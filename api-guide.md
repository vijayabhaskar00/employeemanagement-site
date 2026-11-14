# Employee Hub Developer API

Programmatic **read / create / update** access to the Employee Hub business data
for integration partners. No delete. Server-to-server only.

- Version: `1.0.0`
- Hosted docs (public): <https://stpayrollinvoices.web.app/api-docs.html> — this page plus the interactive OpenAPI reference
- Machine contract: [`openapi.yaml`](openapi.yaml)
- Implementation: [`api/`](api/) — `router.js` (pipeline), `resources.js` (Firestore), `schemas.js` (validation), `compute.js` (payroll + invoice math)

## Base URL

```
https://stpayrollinvoices.web.app/api/v1
```

The raw Cloud Function URL (`https://us-central1-stpayrollinvoices.cloudfunctions.net/api/v1`)
also works; the Hosting URL above is the supported one.

## Health check

`GET /v1` — unauthenticated, no key needed:

```json
{ "status": "ok", "version": "1.0.0", "requestId": "..." }
```

Every other route requires authentication.

## Authentication

Every request needs a developer key, sent as **either**:

```
Authorization: Bearer emh_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
X-API-Key: emh_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Keys are issued out of band (see [Operations](#operations)). A key is stored only
as a hash; it is shown once at creation and is not recoverable. There is **no CORS**
— the API is not callable from a browser.

Failures:

| Situation | Response |
|---|---|
| No key present | `401 { "error": { "code": "unauthorized", "message": "api key missing" } }` |
| Unknown or revoked key | `401 unauthorized` |

## Scopes

A key carries a list of scopes. Each is `{resource}:{read|write}` — `write` covers
create **and** update. `"*"` grants everything.

```
employees:read   employees:write
interns:read     interns:write
payroll:read     payroll:write
intern_payroll:read   intern_payroll:write
invoices:read    invoices:write
expenses:read    expenses:write
office_spaces:read   office_spaces:write
office_bills:read    office_bills:write
crm_brands:read      crm_brands:write
crm_deals:read       crm_activities:read     crm_targets:read
crm_tasks:read       crm_scheduled_mail:read
crm_templates:read   crm_services:read       crm_teams:read
crm:read             crm:write
```

`crm:read` reads every CRM resource, including ones added later, so a CRM key never
needs new scopes. `crm:write` covers CRM writes (today only `crm_brands`).

### Check a key: `GET /v1/me`

Returns the key's `label`, `scopes`, and the resources it may `read` and `write`. A
connected system can call it to find every resource it can sync, including new ones.

```bash
curl https://stpayrollinvoices.web.app/api/v1/me -H "Authorization: Bearer emh_live_..."
# { "label": "Reporting sync", "scopes": ["crm:read", "employees:read"],
#   "read": ["employees", "crm_brands", "crm_deals", ...], "write": [] }
```

`GET` needs `{resource}:read`; `POST`/`PATCH` need `{resource}:write`. Missing scope →
`403 { "error": { "code": "forbidden", "message": "requires scope 'invoices:write'" } }`.

## Conventions

| Operation | Request | Success |
|---|---|---|
| List | `GET /v1/{resource}` | `200 { "data": [ ... ], "nextCursor": "<id>\|null", "requestId": "<uuid>" }` |
| Get one | `GET /v1/{resource}/{id}` | `200 { "data": { ... }, "requestId": "<uuid>" }` |
| Create | `POST /v1/{resource}` | `201 { "data": { ... }, "requestId": "<uuid>" }` |
| Update | `PATCH /v1/{resource}/{id}` | `200 { "data": { ... }, "requestId": "<uuid>" }` |

- No `DELETE` on any resource → `405`.
- `PATCH /v1/invoices/{id}` is **not supported** in v1 → `405`.
- Pagination: `?limit=` (1–100, default 50), `?cursor=` (pass the previous response's
  `nextCursor`). Ordering is by document id, ascending. `nextCursor` is `null` on the
  last page.
- List filtering: only the documented equality filters per resource (below). An
  unknown query parameter → `422`.
- Every response carries an `X-Request-Id` header; it is echoed in the body as
  `requestId` and recorded in the audit log.
- Request bodies are JSON objects. Unknown fields are **rejected** (`422`), not ignored.
  Numeric strings are coerced to numbers.

## Errors

```json
{ "error": { "code": "validation_error", "message": "...", "details": [ { "field": "year", "message": "expected number" } ] }, "requestId": "<uuid>" }
```

| HTTP | `code` | Meaning |
|---|---|---|
| 400 | `bad_request` | Malformed JSON body or query |
| 401 | `unauthorized` | Missing / unknown / revoked key |
| 403 | `forbidden` | Key lacks the required scope |
| 404 | `not_found` | Unknown route, unknown resource, or missing document |
| 405 | `method_not_allowed` | `DELETE`, `PATCH /v1/invoices/*`, `POST` with an id, etc. |
| 409 | `conflict` | Create collides with an existing id / invoice number |
| 422 | `validation_error` | Schema, unknown field, unknown filter, or read-only field |
| 429 | `rate_limited` | Per-key rate limit; includes `Retry-After` (seconds) |
| 500 | `internal` | Unhandled server error — check logs with the `requestId` |

## Rate limits

120 requests per 60 seconds per key. On exceeding it: `429` + `Retry-After: <seconds>`.
The limit is enforced per running server instance, so brief bursts above 120/min are
possible under load; do not rely on it as a hard quota.

---

## Resources

### employees

Filters: `department`, `status`.

| Field | Type | Required on create |
|---|---|---|
| `id` | string | yes |
| `firstName`, `lastName`, `fullName` | string | |
| `email`, `phone` | string | |
| `department`, `designation`, `status` | string | |
| `avatarColor`, `joinDate`, `location` | string | |
| `leaveBalance` | number | |
| `salary` | object | components: `basic`, `hra`, `ca`, `sa`, `overtime`, `arrears`, `incentive`, `conveyance`, `referral`, `professionalTax`, `epf`, `tds`, `esi`, `otherDeductions` (all numbers) |
| `bank` | object | `accountNumber`, `ifscCode`, `bankName`, `branch`, `accountType` |

Read-only via API: `isArchived`, `archivedAt`, `archivedBy`, `restoredAt`, `restoredBy`.

**Changing `salary` recomputes every payroll row** for that employee (components +
gross/net/deductions + `balanceAmount`; payment entries untouched) — the same cascade
the portal runs.

```bash
curl -X POST https://stpayrollinvoices.web.app/api/v1/employees \
  -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d '{"id":"ST0199","fullName":"Priya Nair","department":"Technology","designation":"Engineer","status":"Active","salary":{"basic":60000,"hra":24000,"professionalTax":200,"epf":1800}}'
```

```json
{ "data": { "id": "ST0199", "fullName": "Priya Nair", "department": "Technology", "designation": "Engineer", "status": "Active", "salary": { "basic": 60000, "hra": 24000, "professionalTax": 200, "epf": 1800 }, "createdAt": "2026-09-07T11:42:38.931Z" }, "requestId": "c3b69132-3068-4170-9cc8-50920d6e4f67" }
```

### interns

Filters: `department`, `status`.

| Field | Type | Required on create |
|---|---|---|
| `id` | string | yes |
| `firstName`, `lastName`, `fullName` | string | |
| `email`, `phone`, `department`, `college` | string | |
| `stipend` | number | |
| `status`, `startDate`, `endDate`, `avatarColor` | string | |
| `accountNumber`, `ifscCode`, `bankName` | string | |

No read-only fields; no cascade.

```bash
curl -X PATCH https://stpayrollinvoices.web.app/api/v1/interns/INT-042 \
  -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d '{"status":"Completed","endDate":"2026-08-31"}'
```

### payroll  /  intern_payroll

Filters: `payroll` — `employeeId`, `month`, `year`, `paymentStatus`;
`intern_payroll` — `internId`, `month`, `year`, `paymentStatus`.

Document id is deterministic: `{employeeId}_{month}_{year}` (`{internId}_{month}_{year}`).
`month` is the full English name (`"March"`), `year` is a number.

Writable (create + update): `employeeId`/`internId`, `employeeName`/`internName`,
`department`, `month`, `year`, `totalDays`, `leavesTaken`, `lopDays`, `overtimeHours`,
and the salary component numbers listed under `employees.salary`
(`intern_payroll` also: `stipend`, `deductions`).

The server **always recomputes** and returns `grossSalary`, `netSalary`,
`totalDeductions`, `wholeGrossSalary`, `perDaySalary`, `leaveDeductionAmount`,
`daysWorked`, `balanceAmount` — any values you send for these are ignored.

Read-only via API (sending them → `422`): `paymentStatus`, `paidAmount`, `paidAt`,
`partialPayments`, and every `cashfree*` field. New records are created as
`paymentStatus: "Pending"`. Payments are owned by the Cashfree webhook / reconciliation
path, not this API.

```bash
curl -X POST https://stpayrollinvoices.web.app/api/v1/payroll \
  -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d '{"employeeId":"ST0199","month":"March","year":2026,"basic":60000,"hra":24000,"professionalTax":200,"epf":1800,"leavesTaken":1}'
```

```json
{ "data": { "id": "ST0199_March_2026", "employeeId": "ST0199", "month": "March", "year": 2026, "basic": 60000, "hra": 24000, "professionalTax": 200, "epf": 1800, "leavesTaken": 1, "paymentStatus": "Pending", "paidAmount": 0, "partialPayments": [], "wholeGrossSalary": 84000, "perDaySalary": 2800, "leaveDeductionAmount": 2800, "grossSalary": 81200, "totalDeductions": 2000, "netSalary": 79200, "daysWorked": 29, "balanceAmount": 79200, "createdAt": "2026-09-07T11:42:58.518Z" }, "requestId": "635987cd-200c-485f-be5c-6e553c2de291" }
```

### invoices

Filters: `status`, `documentType`. **Read + create only** — no `PATCH`.

The server assigns `invoiceNumber` (per financial-year sequence, per `documentType`)
inside a transaction, derives the document id from it, and computes all money fields.

Supply:

| Field | Type | Notes |
|---|---|---|
| `items` | array | **required**; each `{ description, hsn?, qty, unit?, rate, gstRate }` |
| `documentType` | string | `Tax Invoice` (default), `Proforma Invoice`, `Quotation`, `Export Invoice` |
| `date`, `dueDate` | string | ISO date; `date` also sets the FY for numbering |
| `client` | object | `{ name, gstin?, stateCode, ... }` — or supply `clientId` to resolve from `clients` |
| `clientId` | string | alternative to `client` |
| `placeOfSupply` | string | GST state code; defaults to `client.stateCode` |
| `discount` | number | flat amount or percent (see `discountType`) |
| `discountType` | string | `flat` (default) or `percent` |
| `notes`, `terms`, `poNumber` | string | |
| `reverseCharge` | boolean | |
| `isExport` | boolean | with `exportType`: `Zero Rated` (no tax) or `With Tax` (IGST) |

Server-computed and returned (never accepted from the caller): `invoiceNumber`, `id`,
`subtotal`, `discount`, `cgst`, `sgst`, `igst`, `cess`, `taxAmount`, `total`,
`outstandingAmount` (= `total`), `isInterState`, `status` (`"Pending"`), `isSent`
(`false`), `receipts` (`[]`), `auditLog`.

Tax logic: inter-state (`placeOfSupply` ≠ the company GST state code) or export-with-tax
→ IGST; otherwise CGST + SGST split evenly. Discount is clamped so it can never exceed
the subtotal.

```bash
curl -X POST https://stpayrollinvoices.web.app/api/v1/invoices \
  -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d '{"documentType":"Tax Invoice","date":"2026-06-01","client":{"name":"X Corp","stateCode":"27","gstin":"27AAACX1234A1Z1"},"items":[{"description":"Consulting","qty":1,"rate":10000,"gstRate":18}]}'
```

```json
{ "data": { "id": "CQ2026-27-001", "invoiceNumber": "CQ2026-27/001", "documentType": "Tax Invoice", "client": { "name": "X Corp", "stateCode": "27" }, "placeOfSupply": "27", "isInterState": true, "subtotal": 10000, "discount": 0, "cgst": 0, "sgst": 0, "igst": 1800, "cess": 0, "taxAmount": 1800, "total": 11800, "outstandingAmount": 11800, "status": "Pending", "isSent": false, "receipts": [], "createdAt": "2026-09-07T11:42:59.321Z", "auditLog": [ { "action": "Tax Invoice Created via API", "time": "2026-09-07T11:42:59.321Z" } ] }, "requestId": "5315ee3a-0e4f-490e-8c8e-0d04ad408887" }
```

### expenses

Filters: `status`, `email`.

| Field | Type | Required on create |
|---|---|---|
| `fullName` | string | yes |
| `amount` | number | yes |
| `purpose` | string | yes |
| `email`, `submittedBy`, `contactNumber` | string | |
| `employeeId`, `department`, `category` | string | |
| `expenseDate`, `notes` | string | |
| `status` | string | on create, only `Pending Admin` or `Pending HR Review` |
| `attachments` | array | |

Read-only via API (→ `422`): `payments`, `approvedAmount`, `netPayable`, `tdsApplied`,
`auditTrail`, every `cashfree*` field. Approvals and payouts are done in the portal.

```bash
curl -X POST https://stpayrollinvoices.web.app/api/v1/expenses \
  -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d '{"fullName":"Priya Nair","email":"priya@example.com","amount":4200,"purpose":"Client travel — Mumbai","category":"Travel","status":"Pending Admin"}'
```

### office_spaces

Offices tracked in Rent & Utilities. The id is built from `name` (`"Lotus Building"` →
`lotus-building`); a name that gives an id already in use → `409`. Renaming later keeps the id.

| Field | Type | Required on create |
|---|---|---|
| `name` | string | yes |
| `address`, `notes` | string | |
| `landlordName`, `landlordPhone`, `landlordPan` | string | |
| `monthlyRent`, `securityDeposit` | number, 0 or more | |
| `rentDueDay` | whole number, 1 to 28 (default 5) | |
| `agreementStart`, `agreementEnd` | string, `YYYY-MM-DD` | |
| `electricityProvider`, `consumerNumber` | string | |
| `trackedTypes` | array of bill types (default `Rent`, `Electricity`) | |
| `active` | boolean (default `true`) | |

Read-only via API (→ `422`): `payeeAccounts`. These accounts decide which payouts mark a
bill Paid, so they are set in the portal.

### office_bills

Rent and utility bills. The id is `{officeId}_{YYYY-MM}_{type}` in lower case (for example
`lotus-building_2026-10_rent`), so an office has one bill per type per month; a second
one → `409`.

Filters: `officeId`, `type`, `year`, `month`, `status`.

| Field | Type | Required on create |
|---|---|---|
| `officeId` | string, an existing office | yes; fixed after create |
| `type` | `Rent`, `Electricity`, `Maintenance`, `Water`, `Internet` or `Other` | yes; fixed after create |
| `year` | whole number, 2000 or later | yes; fixed after create |
| `month` | whole number, 1 to 12 | yes; fixed after create |
| `amount` | number above 0 | yes |
| `tdsAmount` | number, 0 up to `amount` | |
| `dueDate` | string, `YYYY-MM-DD` (Rent defaults to the office's `rentDueDay`) | |
| `billNumber`, `notes` | string | |
| `units` | number | |

Every bill starts `Pending`. Read-only via API (→ `422`): `status`, `paidDate`,
`paymentMode`, `reference`, `partPayments`, `paidAt`, `paidBy`, every `cashfree*` field.
Bills turn Paid from Cashfree payouts or in the portal. A `PATCH` to a Paid bill → `409`.

`partPayments` lists co-owner share payouts on a bill: `account`, `amount`, `tds`,
`transferId`, `utr`, `date`.

```bash
curl -X POST https://stpayrollinvoices.web.app/api/v1/office_bills \
  -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d '{"officeId":"lotus-building","type":"Electricity","year":2026,"month":10,"amount":8123.5,"billNumber":"EB-1042","units":640}'

curl "https://stpayrollinvoices.web.app/api/v1/office_bills?status=Pending&year=2026&month=10" \
  -H "Authorization: Bearer $KEY"
```

### crm_brands

Brands CRM brands (leads). The id is the first contact's work email domain (for example
`acme.com`), or a slug of the company name when the email is on a free mail domain
(gmail.com, outlook.com and so on). It is the same key the portal uses, so pushing a brand
that already exists → `409`, whoever owns it.

A brand created through the API lands **Unassigned** (`ownerUid: null`): only the Super
Admin sees it and hands it to a member. It is then checked against the Invoices clients, and
`existingClientId` is set when it is already a client.

Filters: `ownerUid`, `stage`, `source`.

| Field | Type | Required on create |
|---|---|---|
| `company` | string, not blank | yes |
| `source` | `Apollo`, `LinkedIn`, `Event`, `Referral`, `Direct`, `Inbound` or `Other` | yes |
| `contacts` | array of up to 50 objects with string `name`, `title`, `email`, `phone`, `linkedin` | |
| `stage` | `Prospect` (default), `Emailed`, `Discussion` or `No response` | |
| `website`, `industry` | string | |

Read-only via API (→ `422`): `ownerUid`, `ownerName`, `existingClientId`, `domain`,
`roundStartedAt`, `followUpsSent`, `lastInboundAt`, `lastOutboundAt`, `createdBy`,
`createdAt`, `updatedAt`, `nextStep` (`{text, due}`: the member's next step and its date).
A `PATCH` that sends `contacts` replaces the whole list.

```bash
curl -X POST https://stpayrollinvoices.web.app/api/v1/crm_brands \
  -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d '{"company":"Acme Pvt Ltd","source":"Apollo","contacts":[{"name":"Alice Rao","title":"Marketing Head","email":"alice@acme.com"}]}'
```

### crm_deals, crm_activities, crm_targets, crm_tasks, crm_scheduled_mail, crm_templates, crm_services, crm_teams (read-only)

`POST` and `PATCH` → `405`. A deal's money and its Won and Lost stages come from the
Tax Invoices linked to it, never from the API.

- **crm_deals** — filters `brandId`, `ownerUid`, `creditedUid`, `stage`. Fields include
  `stage` (`Quoted`, `Invoice requested`, `Won`, `Work assigned`, `In progress`,
  `Completed`, `Lost`), `quotedAmount`, `invoiceRequest`, `invoices` (`id`, `number`,
  `taxable`, `date`, `currency`, `live`, `status` — the invoice's payment status),
  `quotations` (`id`, `number`, `date`, `total`, `currency`; never revenue),
  `wonAmount` (live rupee invoices' taxable value), `wonDate`, `creditedUid` (who the
  revenue counts for), `expectedClose` (`YYYY-MM-DD`), `probability` (0–100, chance of
  winning), `lostReason`, `team`.
- **crm_activities** — the timeline: filters `brandId`, `dealId`, `ownerUid`, `type`
  (`created`, `note`, `call`, `stage_change`, `email_out`, `email_in`, `quote`,
  `invoice_requested`, `invoice_raised`, `invoice_cancelled`, `work_update`, `reassigned`, `edited`,
  `next_step`). Email entries carry `subject`, the plain-text body (`text`, at most 20 KB)
  and, when files were attached, `attachments` (file names).
- **crm_targets** — id `{uid}_{YYYY-MM}`; filters `uid`, `month`; fields `target` (new
  brands to onboard that month) and `revenueTarget` (₹ before GST).
- **crm_tasks** — follow-up tasks, always for the brand's owner. Filters `brandId`,
  `ownerUid`, `done` (`true`/`false`, e.g. `?done=false` for open tasks). Fields `text`,
  `company`, `due` (`YYYY-MM-DD`), `time` (`HH:MM`), `remindAt` (ms), `doneAt`, `createdBy`,
  `createdByName`.
- **crm_scheduled_mail** — emails queued with Send later. Filters `brandId`, `ownerUid`,
  `status` (`scheduled`, `sending`, `sent`, `cancelled`, `skipped`, `failed`). Fields `to`,
  `cc`, `bcc`, `subject`, `text`, `sendAt`, `cancelOnReply`, `batchId`, `byName`, `company`.
- **crm_templates** — email templates. **crm_services** — what we sell (`name`, `rate`,
  `unit`), used on quotes. **crm_teams** — delivery teams (`name`). No filters.

Every `crm_brands` write made through the API is logged on that brand's timeline
(`crm_activities`), like a change made in the portal. `byName` is `API: <key label>` and
`byUid` is `null`. Creating a brand logs `created`, a stage change logs `stage_change`, and
any other changed field logs `edited`. Each request is also kept in the API audit log.

Zoho Mail tokens, device alert tokens and lead limits are never exposed.

---

## What the API does not do

- No delete or archive of any record.
- No invoice update (`PATCH /v1/invoices/{id}` → `405`).
- No writes to payroll/expense/office-bill payment fields, or invoice money fields.
- No writes to office payee accounts.
- No writes to CRM deals, activities or targets, or to a brand's owner.
- Does not resync the `metadata/departments` list — the portal does that on next load.
- Does not run the employee id-relocation cascade (changing an employee `id` via the
  API is rejected).

## Operations

All commands run from the `functions/` directory with admin credentials
(`GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json`).

```bash
# Issue a key (prints the plaintext once)
node scripts/apikeys.js mint --label "Acme Corp" --scopes employees:read,invoices:read

# List keys (hash prefix, on/off, label, scopes, last used)
node scripts/apikeys.js list

# Revoke (disable) a key
node scripts/apikeys.js revoke "Acme Corp"

# Change a key's scopes
node scripts/apikeys.js scopes "Acme Corp" --set employees:read,payroll:read
```

- Request log: every request (reads included) emits one structured
  `{"tag":"api_request", ...}` line to Cloud Logging with method, resource, id,
  key hash prefix, client ip, HTTP status and latency. Query it in the console or
  `gcloud logging read 'jsonPayload.tag="api_request"'`.
- Audit log: Firestore collection `api_audit_log` (one entry per `POST`/`PATCH`,
  including validation failures). Admins can read it; only the `api` function writes it.
  Entries self-prune after 180 days: each carries an `expiresAt` timestamp and a
  Firestore TTL policy on that field is declared in `firestore.indexes.json`
  (`fieldOverrides`) and applied by `firebase deploy --only firestore:indexes`.
- Rules: `api_keys` is fully locked (`allow read, write: if false`); `api_audit_log` is
  admin-read, function-write.

## Local testing

```bash
firebase emulators:start --only functions,firestore --project stpayrollinvoices

# in another shell, from functions/
FIRESTORE_EMULATOR_HOST=localhost:8080 node scripts/apikeys.js mint --label "Local" --scopes "*"

BASE=http://127.0.0.1:5001/stpayrollinvoices/us-central1/api
K=emh_live_...   # from the mint output
curl -s "$BASE/v1/employees" -H "Authorization: Bearer $K"
curl -s -X POST "$BASE/v1/employees" -H "Authorization: Bearer $K" -H 'Content-Type: application/json' \
  -d '{"id":"ST-API-1","fullName":"Api Tester","salary":{"basic":20000,"hra":8000}}'
```

Unit tests: `cd functions && npm test`.
