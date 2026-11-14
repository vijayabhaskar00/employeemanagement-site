import{i as e}from"./rolldown-runtime-COiEfhsA.js";import{Dt as t,L as n,Mt as r,On as i,V as a,et as o,n as s,q as c,qt as l}from"./vendor-icons-hnNHp7Ix.js";import{t as u}from"./emailSender-BQSW4O6w.js";import{n as d}from"./ToastContext-DC1fIFG6.js";import{i as f}from"./vendor-react-C1Dy7Cd7.js";var p=e(i(),1),m=f();function h({isOpen:e,onClose:i,initialToEmail:f=``,initialToName:h=``,initialSubject:y=``,initialBody:b=``,attachmentName:x=``,attachmentBase64:S=``,onSendSuccess:C}){let{showToast:w}=d(),[T,E]=(0,p.useState)(``),[D,O]=(0,p.useState)(``),[k,A]=(0,p.useState)(``),[j,M]=(0,p.useState)(``),[N,P]=(0,p.useState)(!1),[F,I]=(0,p.useState)(`preview`),[L,R]=(0,p.useState)(400),z=(0,p.useRef)(null),B=e=>e?e.replace(/<br\s*\/?>/gi,`
`).replace(/<\/p>/gi,`
`).replace(/<\/div>/gi,`
`).replace(/<\/li>/gi,`
`).replace(/<[^>]+>/g,``).replace(/&amp;/g,`&`).replace(/&lt;/g,`<`).replace(/&gt;/g,`>`).replace(/&nbsp;/g,` `).replace(/\n{3,}/g,`

`).trim():``,V=(0,p.useCallback)(()=>{let e=z.current;if(e)try{let t=e.contentDocument||e.contentWindow?.document;t&&t.body&&setTimeout(()=>{let e=t.documentElement.scrollHeight||t.body.scrollHeight;R(e+16)},50)}catch{R(600)}},[]);if((0,p.useEffect)(()=>{e&&(E(f),O(h),A(y),M(B(b)),I(`preview`),R(400))},[e,f,h,y,b]),(0,p.useEffect)(()=>{if(e&&F===`preview`){let e=setTimeout(()=>V(),80);return()=>clearTimeout(e)}},[e,k,j,T,D,x,S,F,V]),!e)return null;let H=()=>{let e=j.split(`
`).map(e=>e.trim()).map(e=>e===``?`<div style="height:10px;"></div>`:`<p style="margin:0 0 8px 0;line-height:1.8;">${e}</p>`).join(`
`);return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${k||`Email Preview`}</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9; padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#b8001f 0%,#7c0010 100%); padding:28px 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:14px; vertical-align:middle;">
                    <div style="width:44px;height:44px;background:rgba(255,255,255,0.2);border-radius:10px;display:inline-block;text-align:center;line-height:44px;font-size:22px;">✉️</div>
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">Student Tribe</div>
                    <div style="font-size:11px;color:rgba(255,255,255,0.75);margin-top:2px;font-weight:500;">A unit of Colosseum CQ Solutions Private Limited</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Subject Bar -->
          <tr>
            <td style="background:#fafafa;border-bottom:1px solid #e8edf3;padding:14px 32px;">
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#94a3b8;margin-bottom:4px;">Subject</div>
              <div style="font-size:15px;font-weight:700;color:#1e293b;">${k||`(No Subject)`}</div>
            </td>
          </tr>

          <!-- To Bar -->
          <tr>
            <td style="background:#fafafa;border-bottom:2px solid #e2e8f0;padding:10px 32px;">
              <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#94a3b8;margin-right:8px;">To:</span>
              <span style="font-size:13px;color:#475569;font-weight:500;">${D||T} &lt;${T}&gt;</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;color:#334155;font-size:14.5px;line-height:1.8;">
              ${e}
            </td>
          </tr>

          ${x?`
          <!-- Attachment -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;width:100%;">
                <tr>
                  <td style="padding:12px 16px;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-right:12px;vertical-align:middle;width:44px;">
                          <div style="width:36px;height:36px;background:rgba(79,70,229,0.08);border-radius:8px;text-align:center;line-height:36px;font-size:18px;">📄</div>
                        </td>
                        <td style="vertical-align:middle;">
                          <div style="font-size:13px;font-weight:700;color:#1e293b;">${x}</div>
                          <div style="font-size:11px;color:#64748b;margin-top:2px;">${S?`PDF · Ready to send`:`PDF · Generating...`}</div>
                        </td>
                        <td align="right" style="vertical-align:middle;white-space:nowrap;padding-left:12px;">
                          <span style="font-size:10px;font-weight:800;padding:3px 10px;border-radius:999px;background:${S?`rgba(16,185,129,0.12)`:`rgba(245,158,11,0.12)`};color:${S?`#059669`:`#d97706`};">
                            ${S?`✓ ATTACHED`:`⏳ LOADING`}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`:``}

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
              <div style="font-size:11px;color:#94a3b8;line-height:1.6;">
                This is an automated email sent via the <strong>Student Tribe HR Platform</strong>.<br/>
                Student Tribe [A unit of Colosseum CQ Solutions Private Limited]<br/>
                <span style="color:#cbd5e1;">Please do not reply directly to this email.</span>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`},U=async()=>{if(!T.trim())w({module:`error`,title:`Missing Recipient`,message:`Recipient email is required.`});else if(!k.trim())w({module:`error`,title:`Missing Subject`,message:`Subject is required.`});else if(!j.trim())w({module:`error`,title:`Missing Message`,message:`Email message is required.`});else if(!S)w({module:`error`,title:`Attachment Not Ready`,message:`Attachment data is still generating. Please wait a moment and try again.`});else{P(!0);try{await u({toEmail:T.trim(),toName:D.trim(),subject:k.trim(),htmlContent:H(),attachmentName:x,attachmentBase64:S}),w({module:`success`,title:`Email Sent ✓`,message:`Successfully emailed "${x}" to ${T}.`}),C&&C(),i()}catch(e){console.error(`[EmailSendError]`,e),w({module:`error`,title:`Email Delivery Failed`,message:e.message||`Brevo API error. Please check credentials in profile settings.`})}finally{P(!1)}}},W=H();return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(`div`,{onClick:i,style:{position:`fixed`,inset:0,background:`rgba(15,23,42,0.55)`,backdropFilter:`blur(8px)`,zIndex:1e4}}),(0,m.jsx)(`div`,{style:{position:`fixed`,top:0,left:0,width:`100%`,height:`100%`,zIndex:10001,overflowY:`auto`,overflowX:`hidden`,display:`flex`,alignItems:`flex-start`,justifyContent:`center`,padding:`clamp(0.5rem, 3vh, 2rem) clamp(0.5rem, 2vw, 1rem)`,boxSizing:`border-box`,pointerEvents:`none`},children:(0,m.jsxs)(`div`,{onClick:e=>e.stopPropagation(),style:{width:`100%`,maxWidth:`820px`,background:`#ffffff`,borderRadius:`1.25rem`,boxShadow:`0 30px 80px rgba(15,23,42,0.25)`,display:`flex`,flexDirection:`column`,overflow:`hidden`,border:`1px solid rgba(226,232,240,0.8)`,animation:`emailModalIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)`,pointerEvents:`all`},children:[(0,m.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,padding:`0.875rem 1.25rem`,background:`linear-gradient(135deg, #b8001f 0%, #7c0010 100%)`,flexShrink:0},children:[(0,m.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.625rem`},children:[(0,m.jsx)(`div`,{style:{background:`rgba(255,255,255,0.15)`,color:`#fff`,padding:`0.375rem`,borderRadius:`0.5rem`,display:`flex`},children:(0,m.jsx)(o,{size:17})}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`span`,{style:{fontWeight:800,fontSize:`0.95rem`,color:`#fff`,display:`block`,lineHeight:1.2},children:`Email Composer`}),(0,m.jsx)(`span`,{style:{fontSize:`0.62rem`,color:`rgba(255,255,255,0.7)`,lineHeight:1},children:`Student Tribe [A unit of Colosseum CQ Solutions Private Limited]`})]})]}),(0,m.jsx)(`button`,{onClick:i,style:{background:`rgba(255,255,255,0.15)`,border:`1px solid rgba(255,255,255,0.25)`,borderRadius:`0.5rem`,padding:`0.35rem`,cursor:`pointer`,display:`flex`,color:`#fff`,transition:`all 0.2s`,flexShrink:0},onMouseOver:e=>{e.currentTarget.style.background=`rgba(255,255,255,0.28)`},onMouseOut:e=>{e.currentTarget.style.background=`rgba(255,255,255,0.15)`},children:(0,m.jsx)(s,{size:15})})]}),(0,m.jsxs)(`div`,{style:{display:`flex`,borderBottom:`1px solid #e2e8f0`,background:`#f8fafc`,flexShrink:0,padding:`0 1.25rem`,flexWrap:`wrap`,gap:`0.25rem`},children:[[{id:`preview`,label:`Visual Preview`,icon:(0,m.jsx)(r,{size:13})},{id:`edit`,label:`Edit Details`,icon:(0,m.jsx)(c,{size:13})}].map(e=>(0,m.jsxs)(`button`,{onClick:()=>I(e.id),style:{display:`flex`,alignItems:`center`,gap:`0.35rem`,padding:`0.65rem 1rem`,background:`none`,border:`none`,borderBottom:F===e.id?`2px solid #b8001f`:`2px solid transparent`,color:F===e.id?`#b8001f`:`#64748b`,fontWeight:F===e.id?800:500,fontSize:`0.78rem`,cursor:`pointer`,transition:`all 0.2s`,marginBottom:`-1px`,whiteSpace:`nowrap`,minHeight:`44px`},children:[e.icon,e.label]},e.id)),(0,m.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,alignItems:`center`,padding:`0 0.25rem`},children:S?(0,m.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`0.3rem`,fontSize:`0.62rem`,fontWeight:800,color:`#059669`,background:`rgba(5,150,105,0.08)`,padding:`0.2rem 0.6rem`,borderRadius:`999px`},children:[(0,m.jsx)(l,{size:9}),` PDF READY`]}):(0,m.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`0.3rem`,fontSize:`0.62rem`,fontWeight:800,color:`#d97706`,background:`rgba(217,119,6,0.08)`,padding:`0.2rem 0.6rem`,borderRadius:`999px`},children:[(0,m.jsx)(a,{size:9,style:{animation:`emailSpin 1s linear infinite`}}),`GENERATING`]})})]}),F===`edit`&&(0,m.jsxs)(`div`,{style:{padding:`1.25rem`,display:`flex`,flexDirection:`column`,gap:`1rem`},children:[(0,m.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(200px, 1fr))`,gap:`1rem`},children:[(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`label`,{style:g,children:`Recipient Name`}),(0,m.jsx)(`input`,{type:`text`,value:D,onChange:e=>O(e.target.value),style:_,placeholder:`Full Name`})]}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`label`,{style:g,children:`Recipient Email`}),(0,m.jsx)(`input`,{type:`email`,value:T,onChange:e=>E(e.target.value),style:_,placeholder:`email@example.com`})]})]}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`label`,{style:g,children:`Email Subject`}),(0,m.jsx)(`input`,{type:`text`,value:k,onChange:e=>A(e.target.value),style:_,placeholder:`Subject line`})]}),(0,m.jsxs)(`div`,{children:[(0,m.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`baseline`,marginBottom:`0.4rem`,flexWrap:`wrap`,gap:`0.25rem`},children:[(0,m.jsx)(`label`,{style:g,children:`Message Body`}),(0,m.jsx)(`span`,{style:{fontSize:`0.6rem`,color:`#94a3b8`},children:`Plain text — styled automatically in the email`})]}),(0,m.jsx)(`textarea`,{value:j,onChange:e=>M(e.target.value),style:{width:`100%`,minHeight:`200px`,padding:`0.75rem`,border:`1.5px solid #cbd5e1`,borderRadius:`0.625rem`,fontSize:`0.875rem`,fontFamily:`'Inter', system-ui, sans-serif`,lineHeight:1.7,resize:`vertical`,outline:`none`,boxSizing:`border-box`,color:`#334155`},placeholder:`Type your message here...`}),(0,m.jsx)(`p`,{style:{margin:`0.35rem 0 0`,fontSize:`0.68rem`,color:`#94a3b8`},children:`💡 Tip: Use blank lines to create paragraphs. The company branding, header, and footer are added automatically.`})]}),x&&(0,m.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.75rem`,padding:`0.75rem 1rem`,background:`#f8fafc`,border:`1px solid #e2e8f0`,borderRadius:`0.75rem`},children:[(0,m.jsx)(`div`,{style:{background:`rgba(79,70,229,0.08)`,padding:`0.4rem`,borderRadius:`0.375rem`,color:`#4f46e5`,display:`flex`,flexShrink:0},children:(0,m.jsx)(t,{size:16})}),(0,m.jsxs)(`div`,{style:{flex:1,minWidth:0},children:[(0,m.jsx)(`p`,{style:{margin:0,fontSize:`0.8rem`,fontWeight:700,color:`#1e293b`,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:x}),(0,m.jsx)(`p`,{style:{margin:0,fontSize:`0.65rem`,color:`#64748b`},children:S?`PDF ready · will be attached automatically`:`PDF generating in background...`})]})]})]}),F===`preview`&&(0,m.jsxs)(`div`,{children:[(0,m.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,padding:`0.5rem 1rem`,background:`#f1f5f9`,borderBottom:`1px solid #e2e8f0`,fontSize:`0.7rem`,color:`#64748b`,flexWrap:`wrap`,rowGap:`0.2rem`},children:[(0,m.jsx)(`span`,{style:{fontWeight:700,color:`#475569`,whiteSpace:`nowrap`},children:`Live Preview`}),(0,m.jsx)(`span`,{style:{color:`#cbd5e1`},children:`·`}),(0,m.jsxs)(`span`,{style:{overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`,maxWidth:`60%`},children:[`To: `,(0,m.jsx)(`strong`,{style:{color:`#1e293b`},children:D||T}),` <`,T,`>`]})]}),(0,m.jsx)(`iframe`,{ref:z,srcDoc:W,title:`Email Preview`,sandbox:`allow-same-origin`,scrolling:`no`,onLoad:V,style:{display:`block`,width:`100%`,height:`${L}px`,border:`none`,overflow:`hidden`,background:`#f1f5f9`,transition:`height 0.2s ease`}},W)]}),(0,m.jsxs)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,alignItems:`center`,gap:`0.625rem`,padding:`0.875rem 1.25rem`,background:`#f8fafc`,borderTop:`1px solid #e2e8f0`,flexShrink:0,flexWrap:`wrap`,rowGap:`0.5rem`},children:[F===`edit`&&(0,m.jsxs)(`button`,{onClick:()=>I(`preview`),style:{...v,color:`#475569`,background:`#fff`,border:`1.5px solid #cbd5e1`},onMouseOver:e=>e.currentTarget.style.background=`#f1f5f9`,onMouseOut:e=>e.currentTarget.style.background=`#fff`,children:[(0,m.jsx)(r,{size:13}),` Preview`]}),F===`preview`&&(0,m.jsxs)(`button`,{onClick:()=>I(`edit`),style:{...v,color:`#475569`,background:`#fff`,border:`1.5px solid #cbd5e1`},onMouseOver:e=>e.currentTarget.style.background=`#f1f5f9`,onMouseOut:e=>e.currentTarget.style.background=`#fff`,children:[(0,m.jsx)(c,{size:13}),` Edit`]}),(0,m.jsx)(`button`,{onClick:i,disabled:N,style:{...v,color:`#475569`,background:`#fff`,border:`1.5px solid #cbd5e1`},onMouseOver:e=>e.currentTarget.style.background=`#f1f5f9`,onMouseOut:e=>e.currentTarget.style.background=`#fff`,children:`Cancel`}),(0,m.jsx)(`button`,{onClick:U,disabled:N||!S,style:{...v,background:S?N?`#7c0010`:`linear-gradient(135deg, #b8001f 0%, #7c0010 100%)`:`#94a3b8`,color:`#fff`,border:`none`,cursor:S?`pointer`:`not-allowed`,boxShadow:S?`0 4px 14px rgba(184,0,31,0.28)`:`none`,fontWeight:800,minWidth:`110px`,justifyContent:`center`},children:N?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(a,{size:13,style:{animation:`emailSpin 0.8s linear infinite`}}),(0,m.jsx)(`span`,{children:`Sending…`})]}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(n,{size:13}),(0,m.jsx)(`span`,{children:`Send Email`})]})})]})]})}),(0,m.jsx)(`style`,{children:`
        @keyframes emailModalIn {
          0%   { opacity: 0; transform: translateY(-12px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0)     scale(1);    }
        }
        @keyframes emailSpin { to { transform: rotate(360deg); } }
      `})]})}var g={display:`block`,fontSize:`0.68rem`,fontWeight:800,textTransform:`uppercase`,letterSpacing:`0.05em`,color:`#475569`,marginBottom:`0.35rem`},_={width:`100%`,padding:`0.6rem 0.875rem`,border:`1.5px solid #cbd5e1`,borderRadius:`0.5rem`,fontSize:`0.875rem`,outline:`none`,boxSizing:`border-box`,color:`#0f172a`,transition:`border-color 0.2s`,fontFamily:`inherit`},v={display:`flex`,alignItems:`center`,gap:`0.4rem`,padding:`0.55rem 1.1rem`,borderRadius:`0.6rem`,fontSize:`0.8rem`,fontWeight:600,cursor:`pointer`,transition:`all 0.2s`,minHeight:`38px`};export{h as t};