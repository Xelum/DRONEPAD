const DEFAULT_INVESTORS = [
  {id:1,name:'Algebris Climatech',type:'VC',fit:'Verified analogue: invested €4M in Dronus within a €15M Series A focused on automated drone systems.',verification:'Verified',stage:'Qualified',next:'Map partner / prepare tailored teaser',source:'Algebris press release, 24 Mar 2026'},
  {id:2,name:'CDP Venture Capital',type:'VC / Public',fit:'Technology Transfer platform and participation in Dronus round. Relevant for deep-tech, mobility and aerospace ecosystem access.',verification:'Verified',stage:'Qualified',next:'Identify correct fund / investment team',source:'CDP Venture Capital + Algebris'},
  {id:3,name:'Eni Next',type:'Corporate VC',fit:'Dronus appears in Eni portfolio for autonomous drones / asset monitoring; potential fit if Dronepad enables industrial infrastructure use cases.',verification:'Verified',stage:'Research',next:'Map strategic use cases + investment contact',source:'Eni 2026 Capital Markets Update'},
  {id:4,name:'PoliHub / Poli360',type:'Incubator / Accelerator',fit:'Network of investors, business angels and VCs with early-stage and Deep Tech focus; can act as ecosystem multiplier.',verification:'Verified',stage:'Qualified',next:'Check admission route and fit for infrastructure deep-tech',source:'PoliHub community page'},
  {id:5,name:'Galaxia',type:'Technology Transfer',fit:'National Technology Transfer Hub focused on aerospace; prototyping and seed orientation. Eligibility / structure must be checked carefully.',verification:'Verified',stage:'Research',next:'Verify eligibility for existing IP / company structure',source:'CDP Venture Capital'},
  {id:6,name:'SIMEST',type:'Public / Export Finance',fit:'Participated in Dronus round; potentially relevant later for international expansion and co-investment structures.',verification:'Preliminary',stage:'Research',next:'Map relevant instrument and timing',source:'Management AI research + Dronus round evidence'},
  {id:7,name:'Azimut Venture Capital',type:'VC',fit:'Participated in Dronus Series A; relevant analogue investor to profile for stage, ticket and thesis.',verification:'Preliminary',stage:'Research',next:'Identify exact fund and partner',source:'Dronus round evidence'},
  {id:8,name:'Growth Capital',type:'Advisor',fit:'Appears in preliminary management research as financial advisor connected to Dronus fundraising ecosystem.',verification:'To verify',stage:'Research',next:'Verify role and assess advisory value',source:'Management AI research'},
  {id:9,name:'United Ventures',type:'VC',fit:'Preliminary target for scalable deep-tech / infrastructure proposition; investment thesis fit must be verified.',verification:'To verify',stage:'Research',next:'Verify thesis, stage and partner',source:'Management AI research'},
  {id:10,name:'Primo Ventures',type:'VC',fit:'Preliminary early-stage VC target. Need to validate fit against hardware / infrastructure / aerospace profile.',verification:'To verify',stage:'Research',next:'Verify current funds and thesis',source:'Management AI research'}
];
const DEFAULT_TASKS = [
  {id:1,title:'Reconstruct prototype cost from current engineering assumptions',stream:'Prototype',status:'Now'},
  {id:2,title:'Confirm complete patent family: IT / PCT / EU / US and current legal status',stream:'IP / Legal',status:'Now'},
  {id:3,title:'Build one-page investment proposition',stream:'Fundraising',status:'Now'},
  {id:4,title:'Identify possible pilot site and decision maker',stream:'Prototype',status:'Next'},
  {id:5,title:'Create investor evidence standard: source + date + contact + fit',stream:'Fundraising',status:'Next'},
  {id:6,title:'Map ENAC / EASA requirements relevant to prototype configuration',stream:'Regulatory',status:'Next'},
  {id:7,title:'Refresh Deloitte assumptions with 2026 costs and market status',stream:'Market',status:'Waiting'},
  {id:8,title:'Organize confidential Data Room structure',stream:'Data Room',status:'Done'}
];
const protoItems = [
  ['Patent & core concept documented','Existing documentation available',true],
  ['Functional requirements frozen','Define exactly what prototype must demonstrate',false],
  ['Engineering package updated','Drawings, loads, materials, interfaces, systems',false],
  ['Bill of Materials (BOM)','Current quantities and specifications',false],
  ['Supplier quotations','At least key cost drivers quoted',false],
  ['Pilot site identified','Physical location + stakeholder',false],
  ['Authorization pathway mapped','Authorities, permits and evidence required',false],
  ['Prototype test plan','Acceptance criteria and validation protocol',false],
  ['Build schedule','Critical path, lead times and dependencies',false],
  ['Total prototype budget','CAPEX + engineering + permits + contingency',false],
  ['Funding structure','Equity / grant / partner / co-investment mix',false]
];
const fundItems=['Engineering & design freeze','Materials / structural modules','MEP, charging & digital systems','Fabrication & assembly','Pilot site preparation','Testing & validation','Regulatory / certification support','Business development & contingency'];
const partners=[
  ['OEM / eVTOL manufacturers','Compatibility requirements, validation, future commercial network.'],
  ['Airport / vertiport operators','Pilot location, operations know-how, demand validation.'],
  ['Engineering & construction','Industrialization, structural design, fabrication and installation.'],
  ['Energy / charging','Electrical infrastructure, storage, charging and energy management.'],
  ['Digital / UTM / cybersecurity','Traffic integration, operational data, remote monitoring and safety.'],
  ['Public authorities / cities','Urban integration, permits, mobility strategy and pilot adoption.']
];
const regs=[
  ['EASA / European framework','Map the technical and operational standards relevant to the actual prototype and intended operating use.','Open'],
  ['ENAC / Italian pathway','Identify the Italian approval and stakeholder pathway for a pilot site and demonstration.','Open'],
  ['Urban / building permissions','Map structural, planning, fire-safety, accessibility and local permitting needs.','Open'],
  ['Aircraft compatibility','Translate target aircraft envelope into platform design requirements.','Open'],
  ['Operations & emergency','Define access, rescue, fire response, passenger/cargo flows and operational responsibilities.','Open'],
  ['US / FAA expansion track','Keep a separate regulatory workstream for future US commercialization.','Later']
];
const docs=[
  ['Italian patent certificate','IP / Legal','Loaded metadata','Patent application 102020000012313 · inventor Emanuele Angeli · holder Helidecks S.r.l.'],
  ['US patent certificate','IP / Legal','Loaded metadata','US 12,018,445 B2 · granted 25 Jun 2024 · assignee Helidecks S.r.l.'],
  ['Deloitte Industrial Plan 2023–2028','Business Plan','Needs 2026 refresh','Historic baseline for assumptions, strategy and financial model.'],
  ['Dronepad Main Presentation','Pitch / Market','Updated Jul 2026','Current market and AAM infrastructure overview.'],
  ['Investor One-Pager','Fundraising','To create','One-page summary for first outreach.'],
  ['Prototype Budget & BOM','Prototype','To create','Evidence-based use of funds and build plan.']
];
const roadmap=[['Diligence-ready IP','Patent family, ownership, corporate vehicle'],['Technical freeze','Prototype requirements + updated engineering'],['Prototype economics','BOM, quotes, schedule, contingency'],['Pilot site','Location + stakeholder + permissions'],['Funding stack','Investor + grant + industrial partner'],['Build & validate','Physical prototype + evidence + first deployment']];
const critical=[['Clarify IP structure','Confirm full patent family and investment vehicle alignment','NOW'],['Define prototype scope','What exactly will be built and tested in phase 1','NOW'],['Rebuild cost base','2026 quotations instead of historic assumptions','NOW'],['Secure pilot path','Target location + permissions + strategic host','NEXT'],['Open investor pipeline','Evidence-based outreach after proposition is ready','NEXT']];

let investors = JSON.parse(localStorage.getItem('dronepadInvestors')||'null') || DEFAULT_INVESTORS;
let tasks = JSON.parse(localStorage.getItem('dronepadTasks')||'null') || DEFAULT_TASKS;
let protoState = JSON.parse(localStorage.getItem('dronepadPrototype')||'null') || protoItems.map(x=>x[2]);

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function initNav(){
  $$('.nav-item').forEach(btn=>btn.onclick=()=>showSection(btn.dataset.section));
  $$('[data-jump]').forEach(btn=>btn.onclick=()=>showSection(btn.dataset.jump));
  $('#menuToggle').onclick=()=>$('#sidebar').classList.toggle('open');
}
function showSection(id){
  $$('.page').forEach(p=>p.classList.toggle('active',p.id===id));
  $$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.section===id));
  $('#crumbTitle').textContent=($(`.nav-item[data-section="${id}"]`)?.textContent||id).replace(/^\d+\s*/, '').toUpperCase();
  $('#sidebar').classList.remove('open'); window.scrollTo({top:0,behavior:'smooth'});
}
function renderCritical(){ $('#criticalPath').innerHTML=critical.map((x,i)=>`<div class="path-row"><div class="path-index">0${i+1}</div><div><b>${x[0]}</b><small>${x[1]}</small></div><span class="tag ${x[2]==='NOW'?'accent':'neutral'}">${x[2]}</span></div>`).join('') }
function renderRoadmap(){ $('#roadmap').innerHTML=roadmap.map((x,i)=>`<div class="gate"><div class="gate-dot"></div><div><b>0${i+1} · ${x[0]}</b><span>${x[1]}</span></div></div>`).join('') }
function renderPrototype(){
  $('#prototypeChecklist').innerHTML=protoItems.map((x,i)=>`<label class="check-item"><input type="checkbox" data-proto="${i}" ${protoState[i]?'checked':''}><span><b>${x[0]}</b><span>${x[1]}</span></span></label>`).join('');
  $$('[data-proto]').forEach(c=>c.onchange=()=>{protoState[+c.dataset.proto]=c.checked;localStorage.setItem('dronepadPrototype',JSON.stringify(protoState)); updatePrototypePct()});
  $('#fundGrid').innerHTML=fundItems.map(x=>`<div class="fund-item"><b>${x}</b><span>€ — to quantify</span></div>`).join(''); updatePrototypePct();
}
function updatePrototypePct(){let pct=Math.round(protoState.filter(Boolean).length/protoState.length*100);$('#prototypePct').textContent=pct+'%';$('#prototypeBar').style.width=pct+'%'}
function badge(v){let c=v==='Verified'?'good':v==='Preliminary'?'accent':v==='To verify'?'warn':'neutral';return `<span class="tag ${c}">${v}</span>`}
function populateFilters(){
  const type=$('#typeFilter'),status=$('#statusFilter');
  type.innerHTML='<option value="all">All types</option>'+[...new Set(investors.map(x=>x.type))].sort().map(x=>`<option>${x}</option>`).join('');
  status.innerHTML='<option value="all">All stages</option>'+['Research','Qualified','Contacted','Meeting','NDA / DD','Term Sheet'].map(x=>`<option>${x}</option>`).join('');
}
function renderInvestors(){
  const q=($('#investorSearch')?.value||'').toLowerCase(), t=$('#typeFilter')?.value||'all', s=$('#statusFilter')?.value||'all';
  const list=investors.filter(x=>(t==='all'||x.type===t)&&(s==='all'||x.stage===s)&&(`${x.name} ${x.fit} ${x.type}`.toLowerCase().includes(q)));
  $('#investorRows').innerHTML=list.map(x=>`<tr><td><span class="crm-name">${x.name}</span><span class="crm-sub">${x.source}</span></td><td>${x.type}</td><td class="crm-fit">${x.fit}</td><td>${badge(x.verification)}</td><td><select class="select-stage" data-stage="${x.id}">${['Research','Qualified','Contacted','Meeting','NDA / DD','Term Sheet'].map(v=>`<option ${v===x.stage?'selected':''}>${v}</option>`).join('')}</select></td><td class="crm-fit">${x.next||'—'}</td></tr>`).join('');
  $$('[data-stage]').forEach(sel=>sel.onchange=()=>{let x=investors.find(v=>v.id==sel.dataset.stage);x.stage=sel.value;saveInvestors();renderPipeline()});
  $('#metricProspects').textContent=investors.length;$('#metricVerified').textContent=`${investors.filter(x=>x.verification==='Verified').length} verified evidence profiles`;
  renderPipeline();
}
function renderPipeline(){const stages=['Research','Qualified','Contacted','Meeting','NDA / DD','Term Sheet'];$('#pipeline').innerHTML=stages.map(s=>`<div class="pipeline-col"><span>${s}</span><b>${investors.filter(x=>x.stage===s).length}</b></div>`).join('')}
function saveInvestors(){localStorage.setItem('dronepadInvestors',JSON.stringify(investors));renderInvestors()}
function investorModal(){const d=$('#investorDialog'),f=$('#investorForm');$('#addInvestorBtn').onclick=()=>d.showModal();$('#saveInvestor').onclick=(e)=>{e.preventDefault();const fd=new FormData(f);investors.push({id:Date.now(),name:fd.get('name'),type:fd.get('type'),fit:fd.get('fit'),verification:'To verify',stage:fd.get('stage'),next:fd.get('next'),source:'Manual entry'});saveInvestors();populateFilters();f.reset();d.close()}}
function renderPartners(){ $('#partnerGrid').innerHTML=partners.map((x,i)=>`<article class="partner-card"><span class="kicker">0${i+1}</span><b>${x[0]}</b><p>${x[1]}</p></article>`).join('') }
function renderRegs(){ $('#regList').innerHTML=regs.map((x,i)=>`<div class="reg-row"><div class="num">0${i+1}</div><div><b>${x[0]}</b><p>${x[1]}</p></div><span class="tag ${x[2]==='Open'?'warn':'neutral'}">${x[2]}</span></div>`).join('') }
function renderDocs(){ $('#documentGrid').innerHTML=docs.map(x=>`<article class="document-card"><span class="kicker">${x[1]}</span><b>${x[0]}</b><span class="tag ${x[2].includes('Loaded')?'good':x[2].includes('create')?'warn':'accent'}">${x[2]}</span><p>${x[3]}</p></article>`).join('') }
function renderTasks(){const statuses=['Now','Next','Waiting','Done'];$('#taskBoard').innerHTML=statuses.map(s=>`<div class="task-column"><h3>${s} · ${tasks.filter(x=>x.status===s).length}</h3>${tasks.filter(x=>x.status===s).map(x=>`<div class="task-card"><b>${x.title}</b><span>${x.stream}</span></div>`).join('')}</div>`).join('')}
function taskModal(){const d=$('#taskDialog'),f=$('#taskForm');$('#addTaskBtn').onclick=()=>d.showModal();$('#saveTask').onclick=(e)=>{e.preventDefault();const fd=new FormData(f);tasks.push({id:Date.now(),title:fd.get('title'),stream:fd.get('stream'),status:fd.get('status')});localStorage.setItem('dronepadTasks',JSON.stringify(tasks));renderTasks();f.reset();d.close()}}
function exportData(){const payload={exportedAt:new Date().toISOString(),project:'Dronepad HQ',version:'0.1',investors,tasks,prototypeChecklist:protoItems.map((x,i)=>({item:x[0],note:x[1],done:protoState[i]}))};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='dronepad-hq-export.json';a.click();URL.revokeObjectURL(a.href)}
function ambient(){const c=$('#ambient'),ctx=c.getContext('2d');let w,h,pts=[];function resize(){w=c.width=innerWidth*devicePixelRatio;h=c.height=innerHeight*devicePixelRatio;pts=Array.from({length:60},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.2+.2,v:Math.random()*.12+.03}))}function draw(){ctx.clearRect(0,0,w,h);ctx.fillStyle='rgba(135,211,237,.35)';pts.forEach(p=>{p.y-=p.v*devicePixelRatio;if(p.y<0)p.y=h;ctx.beginPath();ctx.arc(p.x,p.y,p.r*devicePixelRatio,0,Math.PI*2);ctx.fill()});requestAnimationFrame(draw)}addEventListener('resize',resize);resize();draw()}

initNav();renderCritical();renderRoadmap();renderPrototype();populateFilters();renderInvestors();renderPartners();renderRegs();renderDocs();renderTasks();investorModal();taskModal();ambient();
$('#investorSearch').oninput=renderInvestors;$('#typeFilter').onchange=renderInvestors;$('#statusFilter').onchange=renderInvestors;$('#exportBtn').onclick=exportData;
