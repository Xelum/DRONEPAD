(() => {
  'use strict';

  const D = window.DronepadData;
  let db = D.load();
  let lang = D.getLang();
  const page = document.body.dataset.page || 'dashboard';

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const t = (path) => {
    const parts=path.split('.');
    let v=D.i18n[lang];
    for(const p of parts) v=v?.[p];
    return v ?? path;
  };
  const esc = v => String(v ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const today = () => new Date().toISOString().slice(0,10);
  const nowIso = () => new Date().toISOString();
  const byId = id => db.investors.find(x=>String(x.id)===String(id));
  const save = () => D.save(db);

  const stageLabel = s => t(`stages.${s}`);
  const priorityLabel = p => t(`priority.${p}`);
  const activityLabel = value => {
    const en={Ricerca:'Research',Email:'Email',Call:'Call',Meeting:'Meeting','Follow-up':'Follow-up',Nota:'Note'};
    return lang==='en' ? (en[value]||value) : value;
  };

  function safeUrl(v){
    if(!v) return '';
    try{
      const u=new URL(v,location.href);
      return ['http:','https:'].includes(u.protocol) ? u.href : '';
    }catch(e){return '';}
  }

  function formatDate(v){
    if(!v) return '—';
    const d=new Date(`${v}T12:00:00`);
    if(Number.isNaN(d.getTime())) return v;
    return d.toLocaleDateString(lang==='it'?'it-IT':'en-GB',{day:'2-digit',month:'short',year:'numeric'});
  }

  function daysFromToday(v){
    if(!v) return null;
    const a=new Date(`${today()}T12:00:00`);
    const b=new Date(`${v}T12:00:00`);
    return Math.round((b-a)/86400000);
  }

  function priorityClass(p){
    return p==='Alta'?'high':p==='Bassa'?'low':'medium';
  }

  function applyTranslations(){
    document.documentElement.lang=lang;
    $$('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
    $$('[data-i18n-html]').forEach(el=>el.innerHTML=t(el.dataset.i18nHtml));
    $$('.lang-switch button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  }

  function setLanguage(next){
    lang=next;
    D.setLang(lang);
    applyTranslations();
    renderPage();
  }

  function initLang(){
    $$('.lang-switch button').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));
  }

  function initReveal(){
    document.body.classList.add('js-ready');
    const els=$$('.reveal');
    if(!('IntersectionObserver' in window)){
      els.forEach(x=>x.classList.add('visible'));
      return;
    }
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}
      });
    },{threshold:.08,rootMargin:'0px 0px -5% 0px'});
    els.forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.top<innerHeight*.98)el.classList.add('visible');
      else io.observe(el);
    });
  }

  function backup(){
    const payload={
      exportedAt:nowIso(),
      product:'Dronepad Investor Hub',
      data:db
    };
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=`dronepad-investor-hub-${today()}.json`;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }

  function initCommon(){
    applyTranslations();
    initLang();
    $('#backupBtn')?.addEventListener('click',backup);
    $$('[data-close]').forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.close)?.close()));
    initReveal();
  }

  function metricCards(){
    const total=db.investors.length;
    const advanced=db.investors.filter(x=>x.stage!=='Research').length;
    const contacted=db.investors.filter(x=>['Contacted','Meeting','NDA / DD','Term Sheet'].includes(x.stage)).length;
    const followups=db.investors.filter(x=>x.nextDate && (daysFromToday(x.nextDate)??-1)>=0).length;
    return [
      [t('metric.total'),total,lang==='it'?'nel CRM':'in CRM'],
      [t('metric.advanced'),advanced,lang==='it'?'prospect qualificati':'qualified prospects'],
      [t('metric.contacted'),contacted,lang==='it'?'relazioni avviate':'relationships started'],
      [t('metric.followups'),followups,lang==='it'?'con data futura':'with future date']
    ];
  }

  function renderMetrics(containerId, cls='metric-card'){
    const root=$(containerId);
    if(!root)return;
    root.innerHTML=metricCards().map(x=>`<article class="${cls}"><span>${esc(x[0])}</span><strong>${esc(x[1])}</strong><small>${esc(x[2])}</small></article>`).join('');
  }

  function allActivities(){
    const rows=[];
    db.investors.forEach(inv=>{
      (inv.activities||[]).forEach(a=>rows.push({...a,investorId:inv.id,investorName:inv.name}));
    });
    return rows.sort((a,b)=>String(b.date||b.createdAt||'').localeCompare(String(a.date||a.createdAt||'')));
  }

  /* ---------- Dashboard ---------- */
  function renderDashboard(){
    renderMetrics('#dashboardMetrics');

    const funnel=$('#dashboardFunnel');
    if(funnel){
      funnel.innerHTML=D.STAGES.map(s=>{
        const count=db.investors.filter(x=>x.stage===s).length;
        return `<div class="funnel-item"><span>${esc(stageLabel(s))}</span><b>${count}</b></div>`;
      }).join('');
    }

    const followups=$('#dashboardFollowups');
    if(followups){
      const list=db.investors
        .filter(x=>x.nextDate && (daysFromToday(x.nextDate)??-1)>=0)
        .sort((a,b)=>a.nextDate.localeCompare(b.nextDate))
        .slice(0,7);
      followups.innerHTML=list.length?list.map(x=>`
        <a class="followup-row" href="investor.html?id=${encodeURIComponent(x.id)}">
          <time>${esc(formatDate(x.nextDate))}</time>
          <div><b>${esc(x.name)}</b><small>${esc(x.nextAction||'—')}</small></div>
        </a>`).join(''):`<div class="empty"><strong>${esc(t('empty.followups'))}</strong></div>`;
    }

    const stream=$('#dashboardActivities');
    if(stream){
      const acts=allActivities().slice(0,8);
      stream.innerHTML=acts.length?acts.map(a=>`
        <a class="stream-row" href="investor.html?id=${encodeURIComponent(a.investorId)}">
          <time>${esc(formatDate(a.date))}</time>
          <div><b>${esc(a.title)}</b><small>${esc(a.investorName)} · ${esc(activityLabel(a.type))}${a.details?` · ${esc(a.details)}`:''}</small></div>
        </a>`).join(''):`<div class="empty"><strong>${esc(t('empty.activities'))}</strong></div>`;
    }
  }

  /* ---------- Pipeline ---------- */
  function fillInvestorFormOptions(form){
    const typeSel=form.elements.type;
    const stageSel=form.elements.stage;
    const priSel=form.elements.priority;
    if(typeSel) typeSel.innerHTML=D.TYPES.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
    if(stageSel) stageSel.innerHTML=D.STAGES.map(v=>`<option value="${esc(v)}">${esc(stageLabel(v))}</option>`).join('');
    if(priSel) priSel.innerHTML=D.PRIORITIES.map(v=>`<option value="${esc(v)}">${esc(priorityLabel(v))}</option>`).join('');
  }

  function openInvestorModal(inv=null){
    const d=$('#investorDialog'), f=$('#investorForm');
    if(!d||!f)return;
    fillInvestorFormOptions(f);
    f.reset();
    f.elements.id.value=inv?.id||'';
    f.elements.name.value=inv?.name||'';
    f.elements.type.value=inv?.type||D.TYPES[0];
    f.elements.stage.value=inv?.stage||'Research';
    f.elements.priority.value=inv?.priority||'Media';
    f.elements.contactName.value=inv?.contactName||'';
    f.elements.contactRole.value=inv?.contactRole||'';
    f.elements.contactEmail.value=inv?.contactEmail||'';
    f.elements.contactPhone.value=inv?.contactPhone||'';
    f.elements.website.value=inv?.website||'';
    f.elements.lastContact.value=inv?.lastContact||'';
    f.elements.nextDate.value=inv?.nextDate||'';
    f.elements.thesis.value=inv?.thesis||'';
    f.elements.source.value=inv?.source||'';
    f.elements.nextAction.value=inv?.nextAction||'';
    f.elements.notes.value=inv?.notes||'';
    const title=$('#investorDialogTitle');
    if(title)title.textContent=inv?(lang==='it'?'Modifica prospect':'Edit prospect'):(lang==='it'?'Aggiungi prospect':'Add prospect');
    d.showModal();
  }

  function saveInvestorFromForm(form){
    const fd=new FormData(form);
    const id=String(fd.get('id')||'').trim();
    const existing=id?byId(id):null;
    const oldStage=existing?.stage;
    const item=existing||{
      id:D.uid('inv'),
      createdAt:nowIso(),
      activities:[]
    };
    Object.assign(item,{
      name:String(fd.get('name')||'').trim(),
      type:String(fd.get('type')||D.TYPES[0]),
      stage:String(fd.get('stage')||'Research'),
      priority:String(fd.get('priority')||'Media'),
      contactName:String(fd.get('contactName')||'').trim(),
      contactRole:String(fd.get('contactRole')||'').trim(),
      contactEmail:String(fd.get('contactEmail')||'').trim(),
      contactPhone:String(fd.get('contactPhone')||'').trim(),
      website:String(fd.get('website')||'').trim(),
      lastContact:String(fd.get('lastContact')||''),
      nextDate:String(fd.get('nextDate')||''),
      thesis:String(fd.get('thesis')||'').trim(),
      source:String(fd.get('source')||'').trim(),
      nextAction:String(fd.get('nextAction')||'').trim(),
      notes:String(fd.get('notes')||'').trim(),
      updatedAt:nowIso()
    });
    if(!existing){
      item.activities.push({
        id:D.uid('act'),date:today(),type:'Nota',
        title:lang==='it'?'Prospect inserito nella pipeline':'Prospect added to pipeline',
        details:item.source?`${lang==='it'?'Fonte':'Source'}: ${item.source}`:'',
        nextAction:item.nextAction,nextDate:item.nextDate,createdAt:nowIso()
      });
      db.investors.unshift(item);
    }else if(oldStage!==item.stage){
      item.activities.unshift({
        id:D.uid('act'),date:today(),type:'Nota',
        title:lang==='it'?'Stadio pipeline aggiornato':'Pipeline stage updated',
        details:`${stageLabel(oldStage)} → ${stageLabel(item.stage)}`,
        nextAction:item.nextAction,nextDate:item.nextDate,createdAt:nowIso()
      });
    }
    save();
    return item;
  }

  function removeInvestor(inv, redirect=false){
    if(!inv)return;
    const ok=confirm(lang==='it'?`Eliminare "${inv.name}" dalla pipeline?`:`Delete "${inv.name}" from the pipeline?`);
    if(!ok)return;
    db.investors=db.investors.filter(x=>x.id!==inv.id);
    save();
    if(redirect)location.href='pipeline.html';
    else renderPipeline();
  }

  function filteredInvestors(){
    const q=($('#searchInput')?.value||'').trim().toLowerCase();
    const stage=$('#stageFilter')?.value||'all';
    const type=$('#typeFilter')?.value||'all';
    const priority=$('#priorityFilter')?.value||'all';
    return db.investors.filter(x=>{
      const hay=[x.name,x.type,x.contactName,x.contactRole,x.contactEmail,x.thesis,x.source,x.nextAction,x.notes].join(' ').toLowerCase();
      return (!q||hay.includes(q))&&(stage==='all'||x.stage===stage)&&(type==='all'||x.type===type)&&(priority==='all'||x.priority===priority);
    });
  }

  function fillPipelineFilters(){
    const stage=$('#stageFilter'), type=$('#typeFilter'), pri=$('#priorityFilter');
    if(stage){
      const old=stage.value||'all';
      stage.innerHTML=`<option value="all">${lang==='it'?'Tutti gli stadi':'All stages'}</option>`+D.STAGES.map(v=>`<option value="${esc(v)}">${esc(stageLabel(v))}</option>`).join('');
      stage.value=D.STAGES.includes(old)?old:'all';
    }
    if(type){
      const old=type.value||'all';
      type.innerHTML=`<option value="all">${lang==='it'?'Tutti i tipi':'All types'}</option>`+D.TYPES.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
      type.value=D.TYPES.includes(old)?old:'all';
    }
    if(pri){
      const old=pri.value||'all';
      pri.innerHTML=`<option value="all">${lang==='it'?'Tutte le priorità':'All priorities'}</option>`+D.PRIORITIES.map(v=>`<option value="${esc(v)}">${esc(priorityLabel(v))}</option>`).join('');
      pri.value=D.PRIORITIES.includes(old)?old:'all';
    }
    if($('#searchInput'))$('#searchInput').placeholder=lang==='it'?'Cerca nome, tipo, referente o note...':'Search name, type, contact or notes...';
  }

  function renderPipeline(){
    renderMetrics('#pipelineMetrics','mini-metric');
    fillPipelineFilters();
    const list=filteredInvestors();
    if($('#pipelineCount'))$('#pipelineCount').textContent=String(list.length);

    const rows=$('#pipelineRows');
    if(rows){
      rows.innerHTML=list.length?list.map(x=>`
        <tr>
          <td>
            <a class="investor-name" href="investor.html?id=${encodeURIComponent(x.id)}">${esc(x.name)}</a>
            <span class="subline">${esc(x.thesis||x.source||'—')}</span>
          </td>
          <td>${esc(x.type)}</td>
          <td><select class="stage-select" data-stage-id="${esc(x.id)}">${D.STAGES.map(s=>`<option value="${esc(s)}" ${s===x.stage?'selected':''}>${esc(stageLabel(s))}</option>`).join('')}</select></td>
          <td><span class="tag ${priorityClass(x.priority)}">${esc(priorityLabel(x.priority))}</span></td>
          <td>${esc(formatDate(x.lastContact))}</td>
          <td><b>${esc(x.nextAction||'—')}</b><span class="subline">${x.nextDate?esc(formatDate(x.nextDate)):'—'}</span></td>
          <td><div class="action-row">
            <a class="table-action" href="investor.html?id=${encodeURIComponent(x.id)}">${esc(t('actions.open'))}</a>
            <button class="table-action" data-edit-id="${esc(x.id)}">${esc(t('actions.edit'))}</button>
            <button class="table-action danger" data-delete-id="${esc(x.id)}">${esc(t('actions.delete'))}</button>
          </div></td>
        </tr>`).join(''):`<tr><td colspan="7"><div class="empty"><strong>${esc(t('empty.pipeline'))}</strong></div></td></tr>`;
    }

    const cards=$('#pipelineCards');
    if(cards){
      cards.innerHTML=list.length?list.map(x=>`
        <article class="mobile-card">
          <div class="mobile-card-head">
            <div><a class="investor-name" href="investor.html?id=${encodeURIComponent(x.id)}">${esc(x.name)}</a><small>${esc(x.type)}</small></div>
            <span class="tag ${priorityClass(x.priority)}">${esc(priorityLabel(x.priority))}</span>
          </div>
          <p>${esc(x.thesis||'—')}</p>
          <div class="mobile-card-meta">
            <div><span>${esc(t('table.stage'))}</span><b>${esc(stageLabel(x.stage))}</b></div>
            <div><span>${esc(t('table.last'))}</span><b>${esc(formatDate(x.lastContact))}</b></div>
            <div><span>${esc(t('table.next'))}</span><b>${esc(x.nextAction||'—')}</b></div>
            <div><span>${esc(t('form.nextDate'))}</span><b>${esc(formatDate(x.nextDate))}</b></div>
          </div>
          <select class="stage-select" data-stage-id="${esc(x.id)}">${D.STAGES.map(s=>`<option value="${esc(s)}" ${s===x.stage?'selected':''}>${esc(stageLabel(s))}</option>`).join('')}</select>
          <div class="action-row" style="margin-top:10px">
            <a class="table-action" href="investor.html?id=${encodeURIComponent(x.id)}">${esc(t('actions.open'))}</a>
            <button class="table-action" data-edit-id="${esc(x.id)}">${esc(t('actions.edit'))}</button>
            <button class="table-action danger" data-delete-id="${esc(x.id)}">${esc(t('actions.delete'))}</button>
          </div>
        </article>`).join(''):`<div class="empty"><strong>${esc(t('empty.pipeline'))}</strong></div>`;
    }

    $$('[data-edit-id]').forEach(btn=>btn.onclick=()=>openInvestorModal(byId(btn.dataset.editId)));
    $$('[data-delete-id]').forEach(btn=>btn.onclick=()=>removeInvestor(byId(btn.dataset.deleteId)));
    $$('[data-stage-id]').forEach(sel=>sel.onchange=()=>{
      const inv=byId(sel.dataset.stageId);
      if(!inv)return;
      const old=inv.stage;
      inv.stage=sel.value;
      if(['Contacted','Meeting'].includes(inv.stage)&&!inv.lastContact)inv.lastContact=today();
      inv.updatedAt=nowIso();
      if(old!==inv.stage){
        inv.activities=inv.activities||[];
        inv.activities.unshift({
          id:D.uid('act'),date:today(),type:'Nota',
          title:lang==='it'?'Stadio pipeline aggiornato':'Pipeline stage updated',
          details:`${stageLabel(old)} → ${stageLabel(inv.stage)}`,
          nextAction:inv.nextAction,nextDate:inv.nextDate,createdAt:nowIso()
        });
      }
      save();
      renderPipeline();
    });
  }

  function initPipeline(){
    $('#addInvestorBtn')?.addEventListener('click',()=>openInvestorModal());
    ['#searchInput','#stageFilter','#typeFilter','#priorityFilter'].forEach(sel=>{
      const el=$(sel); if(!el)return;
      el.addEventListener(el.tagName==='INPUT'?'input':'change',renderPipeline);
    });
    $('#investorForm')?.addEventListener('submit',e=>{
      e.preventDefault();
      saveInvestorFromForm(e.currentTarget);
      $('#investorDialog').close();
      renderPipeline();
    });
    renderPipeline();
  }

  /* ---------- Investor detail ---------- */
  function currentDetailInvestor(){
    const id=new URLSearchParams(location.search).get('id');
    return byId(id);
  }

  function fillDetailInvestorForm(inv){
    const f=$('#investorForm');
    fillInvestorFormOptions(f);
    f.elements.id.value=inv.id;
    f.elements.name.value=inv.name||'';
    f.elements.type.value=inv.type||D.TYPES[0];
    f.elements.stage.value=inv.stage||'Research';
    f.elements.priority.value=inv.priority||'Media';
    f.elements.contactName.value=inv.contactName||'';
    f.elements.contactRole.value=inv.contactRole||'';
    f.elements.contactEmail.value=inv.contactEmail||'';
    f.elements.contactPhone.value=inv.contactPhone||'';
    f.elements.website.value=inv.website||'';
    f.elements.lastContact.value=inv.lastContact||'';
    f.elements.nextDate.value=inv.nextDate||'';
    f.elements.thesis.value=inv.thesis||'';
    f.elements.source.value=inv.source||'';
    f.elements.nextAction.value=inv.nextAction||'';
    f.elements.notes.value=inv.notes||'';
  }

  function fillActivityOptions(form){
    const sel=form.elements.type;
    sel.innerHTML=D.ACTIVITY_TYPES.map(v=>`<option value="${esc(v)}">${esc(activityLabel(v))}</option>`).join('');
  }

  function openActivityModal(inv,activity=null){
    const f=$('#activityForm'), d=$('#activityDialog');
    fillActivityOptions(f);
    f.reset();
    f.elements.id.value=activity?.id||'';
    f.elements.date.value=activity?.date||today();
    f.elements.type.value=activity?.type||'Ricerca';
    f.elements.title.value=activity?.title||'';
    f.elements.details.value=activity?.details||'';
    f.elements.nextAction.value=activity?.nextAction||'';
    f.elements.nextDate.value=activity?.nextDate||'';
    $('#activityDialogTitle').textContent=activity?(lang==='it'?'Modifica attività':'Edit activity'):(lang==='it'?'Registra attività':'Add activity');
    d.showModal();
  }

  function saveActivityFromForm(inv,form){
    const fd=new FormData(form);
    const id=String(fd.get('id')||'');
    inv.activities=inv.activities||[];
    let a=id?inv.activities.find(x=>x.id===id):null;
    if(!a){
      a={id:D.uid('act'),createdAt:nowIso()};
      inv.activities.unshift(a);
    }
    Object.assign(a,{
      date:String(fd.get('date')||today()),
      type:String(fd.get('type')||'Ricerca'),
      title:String(fd.get('title')||'').trim(),
      details:String(fd.get('details')||'').trim(),
      nextAction:String(fd.get('nextAction')||'').trim(),
      nextDate:String(fd.get('nextDate')||'')
    });
    if(['Email','Call','Meeting','Follow-up'].includes(a.type)){
      if(!inv.lastContact || a.date>=inv.lastContact)inv.lastContact=a.date;
    }
    if(a.nextAction)inv.nextAction=a.nextAction;
    if(a.nextDate)inv.nextDate=a.nextDate;
    inv.updatedAt=nowIso();
    save();
  }

  function removeActivity(inv,id){
    const a=(inv.activities||[]).find(x=>x.id===id);
    if(!a)return;
    if(!confirm(lang==='it'?`Eliminare l'attività "${a.title}"?`:`Delete activity "${a.title}"?`))return;
    inv.activities=inv.activities.filter(x=>x.id!==id);
    inv.updatedAt=nowIso();
    save();
    renderInvestorDetail();
  }

  function renderInvestorDetail(){
    const inv=currentDetailInvestor();
    if(!inv){
      $('.app-main').innerHTML=`<div class="empty"><strong>${esc(t('empty.notFound'))}</strong><a class="text-link" href="pipeline.html">${esc(t('detail.back'))}</a></div>`;
      return;
    }
    document.title=`${inv.name} — Dronepad Investor Hub`;
    $('#detailType').textContent=inv.type||'INVESTOR';
    $('#detailName').textContent=inv.name;
    $('#detailBadges').innerHTML=`<span class="tag medium">${esc(stageLabel(inv.stage))}</span><span class="tag ${priorityClass(inv.priority)}">${esc(priorityLabel(inv.priority))}</span>`;

    const site=safeUrl(inv.website);
    const info=[
      [t('form.contactName'),inv.contactName?`${inv.contactName}${inv.contactRole?` · ${inv.contactRole}`:''}`:'—'],
      ['Email',inv.contactEmail||'—'],
      [t('form.phone'),inv.contactPhone||'—'],
      [t('form.website'),site?`<a href="${esc(site)}" target="_blank" rel="noopener">${esc(inv.website)}</a>`:'—'],
      [t('form.lastContact'),formatDate(inv.lastContact)],
      [t('form.nextDate'),formatDate(inv.nextDate)]
    ];
    $('#detailInfo').innerHTML=info.map(([k,v])=>`<div class="info-item"><span>${esc(k)}</span><b>${v}</b></div>`).join('');
    $('#detailNext').innerHTML=`<strong>${esc(inv.nextAction||'—')}</strong><time>${inv.nextDate?esc(formatDate(inv.nextDate)):'—'}</time>`;
    $('#detailThesis').textContent=inv.thesis||'—';
    $('#detailSource').textContent=inv.source?`${t('form.source')}: ${inv.source}`:'';
    $('#detailNotes').textContent=inv.notes||'—';

    const timeline=$('#detailTimeline');
    const acts=[...(inv.activities||[])].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
    timeline.innerHTML=acts.length?acts.map(a=>`
      <article class="timeline-item">
        <div class="timeline-date"><b>${esc(formatDate(a.date))}</b><span>${esc(activityLabel(a.type))}</span></div>
        <div class="timeline-copy">
          <h3>${esc(a.title)}</h3>
          <p>${esc(a.details||'')}</p>
          ${a.nextAction?`<div class="timeline-next"><b>${esc(t('form.nextAction'))}:</b> ${esc(a.nextAction)}${a.nextDate?` · ${esc(formatDate(a.nextDate))}`:''}</div>`:''}
        </div>
        <div class="timeline-actions">
          <button class="table-action" data-edit-activity="${esc(a.id)}">${esc(t('actions.edit'))}</button>
          <button class="table-action danger" data-delete-activity="${esc(a.id)}">${esc(t('actions.delete'))}</button>
        </div>
      </article>`).join(''):`<div class="empty"><strong>${esc(t('empty.activities'))}</strong></div>`;

    $$('[data-edit-activity]').forEach(btn=>btn.onclick=()=>openActivityModal(inv,(inv.activities||[]).find(x=>x.id===btn.dataset.editActivity)));
    $$('[data-delete-activity]').forEach(btn=>btn.onclick=()=>removeActivity(inv,btn.dataset.deleteActivity));

    $('#editInvestorBtn').onclick=()=>{fillDetailInvestorForm(inv);$('#investorDialogTitle').textContent=lang==='it'?'Modifica prospect':'Edit prospect';$('#investorDialog').showModal();};
    $('#deleteInvestorBtn').onclick=()=>removeInvestor(inv,true);
    $('#addActivityBtn').onclick=()=>openActivityModal(inv);

    const invForm=$('#investorForm');
    if(invForm&&!invForm.dataset.bound){
      invForm.dataset.bound='1';
      invForm.addEventListener('submit',e=>{
        e.preventDefault();
        saveInvestorFromForm(e.currentTarget);
        $('#investorDialog').close();
        renderInvestorDetail();
      });
    }
    const actForm=$('#activityForm');
    if(actForm&&!actForm.dataset.bound){
      actForm.dataset.bound='1';
      actForm.addEventListener('submit',e=>{
        e.preventDefault();
        const current=currentDetailInvestor();
        saveActivityFromForm(current,e.currentTarget);
        $('#activityDialog').close();
        renderInvestorDetail();
      });
    }
  }

  function renderPage(){
    if(page==='dashboard')renderDashboard();
    if(page==='pipeline')renderPipeline();
    if(page==='investor-detail')renderInvestorDetail();
  }

  initCommon();
  if(page==='pipeline')initPipeline();
  else renderPage();
})();