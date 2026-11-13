const el=id=>document.getElementById(id);
const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels=['None','Beginner','Intermediate','Advanced'];
const apiUrl=String(window.ASSESSMENT_API_URL||'').trim();
const turnstileSiteKey=String(window.ASSESSMENT_TURNSTILE_SITE_KEY||'').trim();
let widgetId=null;
let verifiedToken='';
const canSubmit=window.ASSESSMENT_ENABLE_SUBMISSION===true && /^https:\/\//i.test(apiUrl);
const state={step:1,config:null,questions:[],answers:{},track:'Data Engineer',learner:{name:'',email:'',organization:'',country:'',role:'',goal:'',courseInterest:''},submitted:false,delivery:null};
const currentTrack=()=>state.config?.tracks?.[state.track];
const activeQuestions=()=>state.questions.filter(q=>currentTrack()?.questionIds?.includes(q.id));
const field=(id,label,placeholder='',optional=false)=>`<label class="field"><span>${label}${optional?' <small class="muted">Optional</small>':' <span class="required">*</span>'}</span><input id="${id}" type="${id==='email'?'email':'text'}" maxlength="160" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(state.learner[id])}" ${optional?'':'required'}></label>`;
const panelHead=(kicker,title,description)=>`<div class="panel-header"><div class="micro">${escapeHtml(kicker)}</div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p></div>`;
function setTrack(next){if(!state.config?.tracks?.[next])return;state.track=next;state.answers={};state.delivery=null;state.submitted=false;updateTrackShell();}
function updateTrackShell(){const t=currentTrack();if(!t)return;document.querySelector('.breadcrumbs').textContent=`Education  /  Learning Paths  /  ${state.track}`;el('heroTitle').textContent=`Personalize your ${t.label} learning path.`;}
function progress(){document.querySelectorAll('.step').forEach((node,i)=>{node.classList.toggle('active',i+1===state.step);node.classList.toggle('complete',i+1<state.step);});}
function render(){progress();updateTrackShell();if(state.submitted)return showSubmitted();if(state.step===1)showDetails();else if(state.step===2)showAssessment();else showReview();}
function go(n){widgetId=null;verifiedToken='';state.step=n;render();window.scrollTo({top:0,behavior:'smooth'});}
function showDetails(){const t=currentTrack(),list=Object.entries(state.config.tracks).map(([key,val])=>`<option value="${escapeHtml(key)}" ${state.track===key?'selected':''}>${escapeHtml(val.label)} (${escapeHtml(key)})</option>`).join('');
 el('app').innerHTML=panelHead('STEP 01 / LEARNER DETAILS','Tell us about yourself','Choose the learning path you want to explore, then tell us about your current role and goals.')+`<form id="detailsForm"><div class="form-grid">${field('name','Full name','e.g. Alex Jordan')}${field('email','Work or personal email','e.g. alex@example.com')}${field('organization','Organization','Optional',true)}${field('country','Country','e.g. United Arab Emirates')}<label class="field wide"><span>Learning path you want to explore <span class="required">*</span></span><select id="learningTrack" required>${list}</select><small class="field-hint">This selection controls which skill questions you see. Your current job title does not change the learning path automatically.</small></label>${field('role','Current role','e.g. ML Engineer',true)}${field('courseInterest','Specific Cloudera course or technology you are interested in','Optional: course name, code or technology',true)}<label class="field wide"><span>What would you like to learn? <small class="muted">Optional</small></span><textarea id="goal" maxlength="600" placeholder="Tell us about the skills you want to develop…">${escapeHtml(state.learner.goal)}</textarea></label></div><div id="trackNotice" class="callout" aria-live="polite"><b>Assessment topics:</b> ${escapeHtml(t.description)}. ${activeQuestions().length} questions for this learning path.</div><div class="callout"><b>API pilot check:</b> This sends an empty test request only. Your name, email, and assessment answers are not transmitted. <button class="btn" type="button" id="checkApi">Check AWS connection</button><div id="apiStatus" aria-live="polite" style="margin-top:9px"></div></div><div class="button-bar"><span></span><button class="btn btn-primary" type="submit">Continue to skills assessment →</button></div></form>`;
 document.querySelectorAll('#detailsForm input,#detailsForm textarea').forEach(input=>input.addEventListener('input',e=>{state.learner[e.target.id]=e.target.value;}));
 el('learningTrack').addEventListener('change',e=>{setTrack(e.target.value);const track=currentTrack();el('trackNotice').innerHTML=`<b>Assessment topics:</b> ${escapeHtml(track.description)}. ${activeQuestions().length} questions for this learning path.`;});
 el('checkApi').addEventListener('click',testApiConnection);
 el('detailsForm').addEventListener('submit',e=>{e.preventDefault();const {name,email,country}=state.learner;if(!name.trim()||!country.trim()||!el('email').validity.valid){el('detailsForm').reportValidity();return;}go(2);});
}
function showAssessment(){const qs=activeQuestions(),count=qs.filter(q=>state.answers[q.id]!==undefined).length;
 el('app').innerHTML=panelHead('STEP 02 / PROFICIENCY',`Assess your ${currentTrack().label} skills`,'Choose the level that most closely describes your current experience.')+`<div class="progress-caption" id="progressCaption">${count} of ${qs.length} answered</div>${qs.map((q,i)=>`<section class="question" data-q="${escapeHtml(q.id)}"><div class="q-kicker">QUESTION ${String(i+1).padStart(2,'0')}</div><div class="q-topic">${escapeHtml(q.topic)}</div><h3>${escapeHtml(q.question)}</h3><div class="options">${labels.map((label,v)=>`<label class="option"><input type="radio" name="${escapeHtml(q.id)}" value="${v}" ${state.answers[q.id]===v?'checked':''}><div><strong>Level ${v} — ${label}</strong><small>${escapeHtml(q.levels[String(v)])}</small></div></label>`).join('')}</div></section>`).join('')}<p id="assessmentError" class="error" style="display:none">Please answer all ${qs.length} skill questions to continue.</p><div class="button-bar"><button class="btn" id="back">← Back</button><button class="btn btn-primary" id="next">Review answers →</button></div>`;
 document.querySelectorAll('.question input').forEach(input=>input.addEventListener('change',e=>{state.answers[e.target.name]=Number(e.target.value);el('progressCaption').textContent=`${qs.filter(q=>state.answers[q.id]!==undefined).length} of ${qs.length} answered`;el('assessmentError').style.display='none';}));
 el('back').addEventListener('click',()=>go(1));el('next').addEventListener('click',()=>{if(qs.some(q=>state.answers[q.id]===undefined)){el('assessmentError').style.display='block';return;}go(3);});
}
function snapshot(){return [['Full name',state.learner.name],['Email',state.learner.email],['Country',state.learner.country],['Organization',state.learner.organization||'—'],['Current role',state.learner.role||'—'],['Learning path',state.track],['Course / technology interest',state.learner.courseInterest||'—'],['Learning goal',state.learner.goal||'—']];}
function showReview(){
 const qs=activeQuestions();
 const text=canSubmit?'Please check your details and answers before submitting.':'Please check your details and answers before finishing the preview.';
 const note=canSubmit?'Private pilot: one fictional assessment will be emailed only to the fixed test inbox. This is NOT a Cloudera customer submission.':'Preview only: no learner details or answers are submitted, emailed, or stored. Please use fictional learner details.';
 const action=canSubmit?'Send one private pilot email →':'Finish preview →';
 const privatePilotUi=canSubmit?`<div class="callout" style="margin-top:16px"><strong>Private pilot email test</strong><p style="margin:8px 0">Fictional data only. Your learner email must use @example.com, @example.net or @example.org. The email is sent to the fixed pilot inbox, not to the learner.</p><label class="field"><span>Temporary private test access code</span><input id="pilotAccessCode" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Enter the one-time private test code" required></label><p class="muted">Never put the code in GitHub or the browser configuration.</p></div>`:'';
 const verifyUi=`<div class="callout" style="margin-top:16px"><strong>Security verification — pilot check</strong><p style="margin:8px 0">Complete the Cloudflare check, then test the verification. This sends only a security token to AWS, not learner details.</p><div id="turnstileMount" style="min-height:55px"></div><button type="button" class="btn" id="checkTurnstile" disabled>Verify Turnstile (no email)</button><div id="turnstileStatus" role="status" aria-live="polite" style="margin-top:9px"></div></div>`;
 el('app').innerHTML=panelHead('STEP 03 / REVIEW','Review your assessment',text)+
 `<div class="review-grid">${snapshot().map(([k,v])=>`<div class="review-item"><span>${escapeHtml(k)}</span><strong>${escapeHtml(v)}</strong></div>`).join('')}</div><h3 class="section-title">Your proficiency responses</h3><div class="answer-list">${qs.map(q=>`<div class="answer-item"><strong>${escapeHtml(q.topic)}</strong><span>Level ${state.answers[q.id]} · ${labels[state.answers[q.id]]}</span></div>`).join('')}</div>${verifyUi}${privatePilotUi}<div class="callout">${escapeHtml(note)}</div><div id="submitError" class="error" style="display:none"></div><div class="button-bar"><button class="btn" id="back">← Edit answers</button><button class="btn btn-primary" id="submit">${action}</button></div>`;
 el('back').addEventListener('click',()=>go(2));el('submit').addEventListener('click',sendTestSubmission);
 initTurnstile();
}
function initTurnstile(){
 const status=el('turnstileStatus'),button=el('checkTurnstile');
 verifiedToken='';widgetId=null;
 if(!turnstileSiteKey || turnstileSiteKey==='PASTE_PUBLIC_SITE_KEY_HERE'){
  status.textContent='Setup needed: add the public Site Key to api-config.js.';return;
 }
 let attempts=0;
 const renderWidget=()=>{
  if(!el('turnstileMount'))return; // Navigated away before load.
  if(!window.turnstile){
   if(++attempts<=40) setTimeout(renderWidget,250);
   else status.textContent='Cloudflare could not load. Check browser network settings.';
   return;
  }
  try{
   widgetId=window.turnstile.render('#turnstileMount',{
    sitekey:turnstileSiteKey,action:'assessment_pilot',theme:'light',
    callback:token=>{verifiedToken=token;button.disabled=false;status.textContent='Check completed. Click Verify Turnstile to test AWS validation.';},
    'expired-callback':()=>{verifiedToken='';button.disabled=true;status.textContent='Check expired; please complete it again.';},
    'error-callback':()=>{verifiedToken='';button.disabled=true;status.textContent='Cloudflare check failed. Reload the page and retry.';},
   });
  }catch(err){status.textContent='Could not display security check: '+String(err.message||err);}
 };
 button.addEventListener('click',verifyTurnstileOnly);
 renderWidget();
}
async function verifyTurnstileOnly(){
 const status=el('turnstileStatus'),button=el('checkTurnstile');
 if(!verifiedToken){status.textContent='Complete the Cloudflare verification first.';return;}
 if(!/^https:\/\//i.test(apiUrl)){status.textContent='No HTTPS API is configured.';return;}
 button.disabled=true;status.textContent='Checking token with AWS Lambda; no assessment data is being sent…';
 try{
  const res=await fetch(apiUrl,{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({testTurnstile:true,turnstileToken:verifiedToken}),
  });
  const data=await res.json().catch(()=>({}));
  if(res.ok && data.verified===true && data.sent===false){
   status.textContent='✓ Cloudflare token verified by AWS Lambda. No assessment data or email was sent.';
  }else{
   status.textContent=`Verification failed (HTTP ${res.status}): ${String(data.message||'Please try again.').slice(0,180)}`;
  }
 }catch(err){status.textContent='Verification connection failed: '+String(err.message||err);}
 finally{
  verifiedToken='';
  if(window.turnstile && widgetId!==null){try{window.turnstile.reset(widgetId);}catch(_){}}
 }
}

async function testApiConnection(){
 const button=el('checkApi'),status=el('apiStatus');
 if(!/^https:\/\//i.test(apiUrl)){status.textContent='No API URL is configured.';return;}
 button.disabled=true;status.textContent='Checking AWS connection (sending empty JSON only)…';
 try{
  const res=await fetch(apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
  const data=await res.json().catch(()=>({}));
  if(res.status===503 && data.message==='Assessment email submission is not enabled yet.'){
   status.textContent='✓ Connected to AWS API Gateway and Lambda. Email sending remains disabled.';
  }else{
   status.textContent=`Received HTTP ${res.status}: ${String(data.message||'Unexpected response').slice(0,160)}`;
  }
 }catch(err){status.textContent='Connection check failed: '+String(err.message||err);}
 finally{button.disabled=false;}
}
function getPayload(){return {formVersion:'poc-v1.7-expanded-skills',learningTrack:state.track,learner:{...state.learner},assessment:activeQuestions().map(q=>({questionId:q.id,level:state.answers[q.id]})),isDemo:true};}
async function sendTestSubmission(){
 if(!canSubmit){state.delivery={status:'preview',sent:false};state.submitted=true;render();return;}
 if(!verifiedToken){const error=el('submitError');error.textContent='Complete the Cloudflare security check before submitting.';error.style.display='block';return;}
 const privateCode=String(el('pilotAccessCode')?.value||'').trim();
 if(!/^[a-f0-9]{64}$/.test(privateCode)){const error=el('submitError');error.textContent='Enter the 64-character private pilot access code.';error.style.display='block';return;}
 const submit=el('submit');submit.disabled=true;submit.textContent='Sending…';
 const error=el('submitError');error.style.display='none';
 try{
  const res=await fetch(apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...getPayload(),turnstileToken:verifiedToken,pilotAccessCode:privateCode})});
  const data=await res.json().catch(()=>({}));
  if(!res.ok||data.sent!==true)throw new Error(data.message || 'Email service unavailable.');
  state.delivery={status:'sent',sent:true};state.submitted=true;render();
 }catch(err){
  error.textContent='Submission not completed: '+String(err.message||err);
  error.style.display='block';
  verifiedToken='';
  if(window.turnstile && widgetId!==null){try{window.turnstile.reset(widgetId);}catch(_){}}
  submit.disabled=false;submit.textContent='Try submission again →';
 }
}
function downloadJson(){const blob=new Blob([JSON.stringify(getPayload(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='demo-training-assessment-response.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function restart(){state.submitted=false;state.delivery=null;state.step=1;state.answers={};state.track=state.config.defaultTrack;state.learner={name:'',email:'',organization:'',country:'',role:'',goal:'',courseInterest:''};render();}
function showSubmitted(){
 const sent=state.delivery?.sent===true;
 const title=sent?'Assessment submitted.':'Assessment preview complete.';
 const description=sent?'The email service accepted one fictional assessment for the private pilot test inbox. This is not confirmation of inbox delivery.':'This is a visual demonstration only. No responses were sent, emailed, stored, or submitted to Cloudera.';
 const tag=sent?'SUBMISSION ACCEPTED':'PREVIEW COMPLETED';
 el('app').innerHTML=`<div class="success-box"><div class="success-icon">✓</div><div class="micro">${tag}</div><h2>${title}</h2><p>${description}</p><div class="button-bar"><button class="btn btn-primary" id="restart">Start a new assessment →</button></div></div>`;
 el('restart').addEventListener('click',restart);
}
fetch('./data/questions.json',{cache:'no-store'}).then(async response=>{
 if(!response.ok)throw new Error(`Questions HTTP ${response.status}`);
 return response.json();
}).then(d=>{
 if(!d.tracks||!d.questions)throw Error('Invalid question configuration.');
 state.config=d;state.questions=d.questions;state.track=d.defaultTrack;render();
}).catch(e=>{
 el('app').innerHTML=`<div class="error">Could not load assessment questions. Please open through an HTTP website or local test server. (${escapeHtml(e.message)})</div>`;
 console.error(e);
});
