(() => {
  'use strict';

  const D = window.DronepadData;
  const Cloud = window.DronepadCloud;
  let db = {investors:[]};
  let lang = D.getLang();
  let session = null;
  let enteringApp = false;
  const page = document.body.dataset.page || 'home';

  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  const t = path => {
    let v=D.i18n[lang];
    for(const p of path.split('.')) v=v?.[p];
    return v ?? path;
  };
  const esc = v => String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const today = ()=>new Date().toISOString().slice(0,10);
  const nowIso = ()=>new Date().toISOString();
  const byId = id => db.investors.find(x=>String(x.id)===String(id));
  const stageLabel = s=>t(`stages.${s}`);
  const priorityLabel = p=>t(`priority.${p}`);
  const activityLabel = v=>lang==='en'?({Ricerca:'Research',Email:'Email',Call:'Call',Meeting:'Meeting','Follow-up':'Follow-up',Nota:'Note'}[v]||v):v;

  function safeUrl(v){
    if(!v)return'';
    try{
      const u=new URL(v,location.href);
      return ['http:','https:'].includes(u.protocol)?u.href:'';
    }catch{return'';}
  }

  function formatDate(v){
    if(!v)return'—';
    const d=new Date(`${v}T12:00:00`);
    return Number.isNaN(d.getTime())?v:d.toLocaleDateString(lang==='it'?'it-IT':'en-GB',{day:'2-digit',month:'short',year:'numeric'});
  }

  function daysFromToday(v){
    if(!v)return null;
    const a=new Date(`${today()}T12:00:00`);
    const b=new Date(`${v}T12:00:00`);
    return Math.round((b-a)/86400000);
  }

  function priorityClass(p){return p==='Alta'?'high':p==='Bassa'?'low':'medium';}

  function setBusy(message){
    let el=$('#appBusy');
    if(!el){
      el=document.createElement('div');
      el.id='appBusy';
      el.className='app-busy';
      el.innerHTML='<div class="busy-card"><i></i><strong></strong><span></span></div>';
      document.body.appendChild(el);
    }
    el.querySelector('strong').textContent=message || (lang==='it'?'Sincronizzazione dati…':'Syncing data…');
    el.querySelector('span').textContent=lang==='it'?'Dronepad Investor Hub':'Dronepad Investor Hub';
    el.classList.add('show');
  }

  function clearBusy(){ $('#appBusy')?.classList.remove('show'); }

  function toast(message,kind='info'){
    let el=$('#toast');
    if(!el){
      el=document.createElement('div');
      el.id='toast';
      el.className='toast';
      document.body.appendChild(el);
    }
    el.textContent=message;
    el.className=`toast show ${kind}`;
    clearTimeout(el._timer);
    el._timer=setTimeout(()=>el.classList.remove('show'),3200);
  }

  function createAuthGate(){
    if($('#authGate'))return;
    const gate=document.createElement('div');
    gate.id='authGate';
    gate.className='auth-gate';
    gate.innerHTML=`
      <div class="auth-card">
        <div class="auth-brand">
          <img src="assets/dronepad-logo.png" alt="Dronepad" />
          <div><strong>DRONEPAD</strong><span>Investor Hub</span></div>
        </div>
        <span class="kicker">PRIVATE ACCESS</span>
        <h1>${lang==='it'?'Accedi al workspace':'Sign in to the workspace'}</h1>
        <p>${lang==='it'?'Inserisci l’utente che hai creato su Supabase. I dati della pipeline verranno letti e salvati direttamente nel database online.':'Use the account created in Supabase. Pipeline data will be read from and saved directly to the online database.'}</p>
        <form id="authForm">
          <label><span>Email</span><input name="email" type="email" autocomplete="email" required /></label>
          <label><span>Password</span><input name="password" type="password" autocomplete="current-password" required /></label>
          <button class="primary-btn auth-submit" type="submit">${lang==='it'?'Accedi':'Sign in'}</button>
          <div class="auth-error" id="authError"></div>
        </form>
      </div>`;
    document.body.appendChild(gate);

    $('#authForm').addEventListener('submit',async e=>{
      e.preventDefault();
      const f=new FormData(e.currentTarget);
      const email=String(f.get('email')||'').trim();
      const password=String(f.get('password')||'');
      $('#authError').textContent='';
      const btn=e.currentTarget.querySelector('button[type="submit"]');
      btn.disabled=true;
      btn.textContent=lang==='it'?'Accesso…':'Signing in…';
      try{
        const result=await Cloud.signIn(email,password);
        session=result.session || null;
        await enterApp();
      }catch(err){
        $('#authError').textContent=authErrorText(err);
      }finally{
        btn.disabled=false;
        btn.textContent=lang==='it'?'Accedi':'Sign in';
      }
    });
  }

  function authErrorText(err){
    const msg=String(err?.message||err||'');
    if(/invalid login credentials/i.test(msg)) return lang==='it'?'Email o password non corrette.':'Incorrect email or password.';
    if(/email not confirmed/i.test(msg)) return lang==='it'?'L’email dell’utente non risulta ancora confermata.':'The user email is not confirmed yet.';
    if(/failed to fetch|network/i.test(msg)) return lang==='it'?'Connessione a Supabase non riuscita. Controlla Internet e riprova.':'Could not connect to Supabase. Check your connection and try again.';
    return msg || (lang==='it'?'Accesso non riuscito.':'Sign in failed.');
  }

  function hideAuthGate(){ $('#authGate')?.classList.add('hidden'); }
  function showAuthGate(){ $('#authGate')?.classList.remove('hidden'); }

  function addAccountControls(){
    const actions=$('.header-actions');
    if(!actions || $('#accountArea'))return;
    const wrap=document.createElement('div');
    wrap.id='accountArea';
    wrap.className='account-area';
    wrap.innerHTML=`
      <button class="sync-pill" id="syncPill" type="button" title="Supabase">
        <i></i><span>${lang==='it'?'SYNC ATTIVA':'SYNC ON'}</span>
      </button>
      <button class="account-btn" id="accountBtn" type="button">${esc((session?.user?.email||'A').slice(0,1).toUpperCase())}</button>
      <div class="account-menu" id="accountMenu">
        <strong>${esc(session?.user?.email||'')}</strong>
        <span>${lang==='it'?'Database Supabase connesso':'Supabase database connected'}</span>
        <button id="logoutBtn" type="button">${lang==='it'?'Esci':'Sign out'}</button>
      </div>`;
    actions.appendChild(wrap);
    $('#accountBtn').onclick=()=>$('#accountMenu').classList.toggle('open');
    $('#logoutBtn').onclick=async()=>{
      try{
        await Cloud.signOut();
        session=null;
        $('#accountArea')?.remove();
        showAuthGate();
      }catch(err){toast(authErrorText(err),'error');}
    };
    document.addEventListener('click',e=>{
      if(!wrap.contains(e.target))$('#accountMenu')?.classList.remove('open');
    });
  }

  function applyTranslations(){
    document.documentElement.lang=lang;
    $$('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
    $$('[data-i18n-html]').forEach(el=>el.innerHTML=t(el.dataset.i18nHtml));
    $$('.lang-switch button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
    const syncText=$('#syncPill span');
    if(syncText)syncText.textContent=lang==='it'?'SYNC ATTIVA':'SYNC ON';
  }

  function setLanguage(v){
    lang=v==='en'?'en':'it';
    D.setLang(lang);
    applyTranslations();
    renderPage();
  }

  function initReveal(){
    document.body.classList.add('js-ready');
    const els=$$('.reveal');
    if(!('IntersectionObserver'in window)){els.forEach(e=>e.classList.add('visible'));return;}
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}
    }),{threshold:.08,rootMargin:'0px 0px -5% 0px'});
    els.forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.top<innerHeight*.96)el.classList.add('visible');
      else io.observe(el);
    });
  }

  function backup(){
    const blob=new Blob([JSON.stringify({
      exportedAt:nowIso(),
      product:'Dronepad Investor Hub',
      source:'Supabase',
      data:db
    },null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=`dronepad-investor-hub-${today()}.json`;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }

  function initCommon(){
    applyTranslations();
    $$('.lang-switch button').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
    $('#backupBtn')?.addEventListener('click',backup);
    $$('[data-close]').forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.close)?.close()));
    initReveal();
    createAuthGate();
  }

  async function loadCloudDatabase(){
    setBusy(lang==='it'?'Caricamento pipeline…':'Loading pipeline…');
    try{
      let loaded=await Cloud.loadAll();
      if(!loaded.investors.length){
        const local=D.load();
        const source=(local?.investors?.length?local:{investors:D.seed?.investors||[]});
        const result=await Cloud.migrateLocalIfEmpty(source);
        loaded=result.db;
        if(result.migrated){
          toast(lang==='it'?'Investitori iniziali importati nel database Supabase.':'Initial investors imported into Supabase.','success');
        }
      }
      db=loaded;
      D.save(db); // cache di sicurezza, Supabase resta la fonte principale
      return db;
    }finally{
      clearBusy();
    }
  }

  async function enterApp(){
    if(enteringApp) return;
    enteringApp=true;
    try{
      hideAuthGate();
      await loadCloudDatabase();
      addAccountControls();
      renderPage();
    }catch(err){
      showAuthGate();
      const box=$('#authError');
      if(box)box.textContent=authErrorText(err);
      throw err;
    }finally{
      enteringApp=false;
    }
  }

  function metricData(){
    const total=db.investors.length;
    const advanced=db.investors.filter(x=>x.stage!=='Research').length;
    const contacted=db.investors.filter(x=>['Contacted','Meeting','NDA / DD','Term Sheet'].includes(x.stage)).length;
    const followups=db.investors.filter(x=>x.nextDate&&(daysFromToday(x.nextDate)??-1)>=0).length;
    return [[t('metric.total'),total],[t('metric.advanced'),advanced],[t('metric.contacted'),contacted],[t('metric.followups'),followups]];
  }

  function renderMetrics(id){
    const root=$(id);
    if(root)root.innerHTML=metricData().map(([l,v])=>`<article class="metric-card"><span>${esc(l)}</span><strong>${v}</strong></article>`).join('');
  }

  function allActivities(){
    const rows=[];
    db.investors.forEach(inv=>(inv.activities||[]).forEach(a=>rows.push({...a,investorId:inv.id,investorName:inv.name})));
    return rows.sort((a,b)=>String(b.date||b.createdAt||'').localeCompare(String(a.date||a.createdAt||'')));
  }

  function renderHome(){
    renderMetrics('#dashboardMetrics');

    const funnel=$('#dashboardFunnel');
    if(funnel)funnel.innerHTML=D.STAGES.map(s=>`<div class="funnel-item"><span>${esc(stageLabel(s))}</span><b>${db.investors.filter(x=>x.stage===s).length}</b></div>`).join('');

    const follow=$('#dashboardFollowups');
    if(follow){
      const list=db.investors.filter(x=>x.nextDate&&(daysFromToday(x.nextDate)??-1)>=0).sort((a,b)=>a.nextDate.localeCompare(b.nextDate)).slice(0,6);
      follow.innerHTML=list.length?list.map(x=>`<a class="list-row" href="investor.html?id=${encodeURIComponent(x.id)}"><time>${esc(formatDate(x.nextDate))}</time><div><b>${esc(x.name)}</b><small>${esc(x.nextAction||'—')}</small></div></a>`).join(''):`<div class="empty">${esc(t('empty.followups'))}</div>`;
    }

    const acts=$('#dashboardActivities');
    if(acts){
      const list=allActivities().slice(0,7);
      acts.innerHTML=list.length?list.map(a=>`<a class="list-row" href="investor.html?id=${encodeURIComponent(a.investorId)}"><time>${esc(formatDate(a.date))}</time><div><b>${esc(a.title)}</b><small>${esc(a.investorName)} · ${esc(activityLabel(a.type))}${a.details?` · ${esc(a.details)}`:''}</small></div></a>`).join(''):`<div class="empty">${esc(t('empty.activities'))}</div>`;
    }
  }

  function fillOptions(f){
    if(!f)return;
    f.elements.type.innerHTML=D.TYPES.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
    f.elements.stage.innerHTML=D.STAGES.map(v=>`<option value="${esc(v)}">${esc(stageLabel(v))}</option>`).join('');
    f.elements.priority.innerHTML=D.PRIORITIES.map(v=>`<option value="${esc(v)}">${esc(priorityLabel(v))}</option>`).join('');
  }

  function openInvestorModal(inv=null){
    const f=$('#investorForm');
    if(!f)return;
    fillOptions(f);
    f.reset();
    const keys=['id','name','type','stage','priority','contactName','contactRole','contactEmail','contactPhone','website','lastContact','nextDate','thesis','source','nextAction','notes'];
    keys.forEach(k=>{ if(f.elements[k]) f.elements[k].value=inv?.[k]||''; });
    if(!inv){
      f.elements.type.value='VC';
      f.elements.stage.value='Research';
      f.elements.priority.value='Media';
    }
    $('#investorDialogTitle').textContent=inv?(lang==='it'?'Modifica prospect':'Edit prospect'):(lang==='it'?'Aggiungi prospect':'Add prospect');
    $('#investorDialog').showModal();
  }

  function investorFromForm(form,existing=null){
    const fd=new FormData(form);
    return {
      ...(existing||{}),
      name:String(fd.get('name')||'').trim(),
      type:String(fd.get('type')||'VC'),
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
      notes:String(fd.get('notes')||'').trim()
    };
  }

  async function saveInvestorForm(form){
    const id=String(new FormData(form).get('id')||'');
    const existing=id?byId(id):null;
    const previousStage=existing?.stage;
    const payload=investorFromForm(form,existing);

    setBusy(lang==='it'?'Salvataggio investitore…':'Saving investor…');
    try{
      if(existing){
        const saved=await Cloud.updateInvestor(existing.id,payload);
        saved.activities=existing.activities||[];
        const idx=db.investors.findIndex(x=>x.id===existing.id);
        db.investors[idx]=saved;

        if(previousStage!==saved.stage){
          const a=await Cloud.createActivity(saved.id,{
            date:today(),type:'Nota',
            title:lang==='it'?'Stadio pipeline aggiornato':'Pipeline stage updated',
            details:`${stageLabel(previousStage)} → ${stageLabel(saved.stage)}`,
            nextAction:saved.nextAction,nextDate:saved.nextDate
          });
          saved.activities.unshift(a);
        }
      }else{
        const saved=await Cloud.createInvestor(payload);
        const initial=await Cloud.createActivity(saved.id,{
          date:today(),type:'Nota',
          title:lang==='it'?'Prospect inserito nella pipeline':'Prospect added to pipeline',
          details:saved.source?`${lang==='it'?'Fonte':'Source'}: ${saved.source}`:'',
          nextAction:saved.nextAction,nextDate:saved.nextDate
        });
        saved.activities=[initial];
        db.investors.unshift(saved);
      }
      D.save(db);
      toast(lang==='it'?'Salvato su Supabase.':'Saved to Supabase.','success');
    }finally{
      clearBusy();
    }
  }

  async function removeInvestor(inv,redirect=false){
    if(!inv)return;
    if(!confirm(lang==='it'?`Eliminare "${inv.name}" dalla pipeline?`:`Delete "${inv.name}" from the pipeline?`))return;
    setBusy(lang==='it'?'Eliminazione…':'Deleting…');
    try{
      await Cloud.deleteInvestor(inv.id);
      db.investors=db.investors.filter(x=>x.id!==inv.id);
      D.save(db);
      if(redirect)location.href='pipeline.html';
      else renderPipeline();
    }catch(err){toast(authErrorText(err),'error');}
    finally{clearBusy();}
  }

  function fillFilters(){
    const s=$('#stageFilter'),ty=$('#typeFilter'),p=$('#priorityFilter');
    const sv=s?.value||'all',tv=ty?.value||'all',pv=p?.value||'all';
    if(s){
      s.innerHTML=`<option value="all">${lang==='it'?'Tutti gli stadi':'All stages'}</option>`+D.STAGES.map(v=>`<option value="${esc(v)}">${esc(stageLabel(v))}</option>`).join('');
      s.value=D.STAGES.includes(sv)?sv:'all';
    }
    if(ty){
      ty.innerHTML=`<option value="all">${lang==='it'?'Tutti i tipi':'All types'}</option>`+D.TYPES.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
      ty.value=D.TYPES.includes(tv)?tv:'all';
    }
    if(p){
      p.innerHTML=`<option value="all">${lang==='it'?'Tutte le priorità':'All priorities'}</option>`+D.PRIORITIES.map(v=>`<option value="${esc(v)}">${esc(priorityLabel(v))}</option>`).join('');
      p.value=D.PRIORITIES.includes(pv)?pv:'all';
    }
    if($('#searchInput'))$('#searchInput').placeholder=lang==='it'?'Cerca nome, tipo, referente o note...':'Search name, type, contact or notes...';
  }

  function filtered(){
    const q=($('#searchInput')?.value||'').toLowerCase();
    const s=$('#stageFilter')?.value||'all';
    const ty=$('#typeFilter')?.value||'all';
    const p=$('#priorityFilter')?.value||'all';
    return db.investors.filter(x=>
      [x.name,x.type,x.contactName,x.contactRole,x.contactEmail,x.thesis,x.source,x.nextAction,x.notes].join(' ').toLowerCase().includes(q) &&
      (s==='all'||x.stage===s) &&
      (ty==='all'||x.type===ty) &&
      (p==='all'||x.priority===p)
    );
  }

  function renderPipeline(){
    renderMetrics('#pipelineMetrics');
    fillFilters();
    const list=filtered();
    if($('#pipelineCount'))$('#pipelineCount').textContent=list.length;

    const root=$('#pipelineList');
    if(root){
      root.innerHTML=list.length?list.map(x=>`
        <article class="investor-row-card">
          <div class="investor-main">
            <a class="investor-name" href="investor.html?id=${encodeURIComponent(x.id)}">${esc(x.name)}</a>
            <span class="investor-type">${esc(x.type)}</span>
            <p>${esc(x.thesis||x.source||'—')}</p>
          </div>
          <div class="investor-field">
            <span class="field-label">${esc(t('table.stage'))}</span>
            <select class="stage-select" data-stage-id="${esc(x.id)}">
              ${D.STAGES.map(s=>`<option value="${esc(s)}" ${s===x.stage?'selected':''}>${esc(stageLabel(s))}</option>`).join('')}
            </select>
          </div>
          <div class="investor-field">
            <span class="field-label">${esc(t('table.priority'))}</span>
            <span class="tag ${priorityClass(x.priority)}">${esc(priorityLabel(x.priority))}</span>
          </div>
          <div class="investor-field">
            <span class="field-label">${esc(t('table.last'))}</span>
            <strong>${esc(formatDate(x.lastContact))}</strong>
          </div>
          <div class="investor-field investor-next">
            <span class="field-label">${esc(t('table.next'))}</span>
            <strong>${esc(x.nextAction||'—')}</strong>
            <small>${esc(formatDate(x.nextDate))}</small>
          </div>
          <div class="investor-actions">
            <a class="table-action" href="investor.html?id=${encodeURIComponent(x.id)}">${esc(t('actions.open'))}</a>
            <button class="table-action" data-edit-id="${esc(x.id)}">${esc(t('actions.edit'))}</button>
            <button class="table-action danger" data-delete-id="${esc(x.id)}">${esc(t('actions.delete'))}</button>
          </div>
        </article>`).join(''):`<div class="empty">${esc(t('empty.pipeline'))}</div>`;
    }

    $$('[data-edit-id]').forEach(b=>b.onclick=()=>openInvestorModal(byId(b.dataset.editId)));
    $$('[data-delete-id]').forEach(b=>b.onclick=()=>removeInvestor(byId(b.dataset.deleteId)));
    $$('[data-stage-id]').forEach(sel=>sel.onchange=async()=>{
      const inv=byId(sel.dataset.stageId);
      if(!inv)return;
      const old=inv.stage;
      const copy={...inv,stage:sel.value};
      if(['Contacted','Meeting'].includes(copy.stage)&&!copy.lastContact)copy.lastContact=today();

      setBusy(lang==='it'?'Aggiornamento pipeline…':'Updating pipeline…');
      try{
        const saved=await Cloud.updateInvestor(inv.id,copy);
        saved.activities=inv.activities||[];
        Object.assign(inv,saved);

        if(old!==inv.stage){
          const a=await Cloud.createActivity(inv.id,{
            date:today(),type:'Nota',
            title:lang==='it'?'Stadio pipeline aggiornato':'Pipeline stage updated',
            details:`${stageLabel(old)} → ${stageLabel(inv.stage)}`,
            nextAction:inv.nextAction,nextDate:inv.nextDate
          });
          inv.activities.unshift(a);
        }
        D.save(db);
        renderPipeline();
      }catch(err){
        sel.value=old;
        toast(authErrorText(err),'error');
      }finally{clearBusy();}
    });
  }

  function initPipeline(){
    fillFilters();

    const addBtn=$('#addInvestorBtn');
    if(addBtn && !addBtn.dataset.bound){
      addBtn.dataset.bound='1';
      addBtn.addEventListener('click',()=>openInvestorModal());
    }

    ['#searchInput','#stageFilter','#typeFilter','#priorityFilter'].forEach(s=>{
      const el=$(s);
      if(!el || el.dataset.bound) return;
      el.dataset.bound='1';
      el.addEventListener(el.tagName==='INPUT'?'input':'change',renderPipeline);
    });

    const form=$('#investorForm');
    if(form && !form.dataset.bound){
      form.dataset.bound='1';
      form.addEventListener('submit',async e=>{
        e.preventDefault();
        try{
          await saveInvestorForm(e.currentTarget);
          $('#investorDialog').close();
          renderPipeline();
        }catch(err){toast(authErrorText(err),'error');}
      });
    }

    renderPipeline();
  }

  function currentInvestor(){return byId(new URLSearchParams(location.search).get('id'));}

  function fillDetailForm(inv){
    const f=$('#investorForm');
    fillOptions(f);
    ['id','name','type','stage','priority','contactName','contactRole','contactEmail','contactPhone','website','lastContact','nextDate','thesis','source','nextAction','notes'].forEach(k=>{
      if(f.elements[k])f.elements[k].value=inv[k]||'';
    });
  }

  function fillActivityOptions(f){
    f.elements.type.innerHTML=D.ACTIVITY_TYPES.map(v=>`<option value="${esc(v)}">${esc(activityLabel(v))}</option>`).join('');
  }

  function openActivity(inv,a=null){
    const f=$('#activityForm');
    fillActivityOptions(f);
    f.reset();
    f.elements.id.value=a?.id||'';
    f.elements.date.value=a?.date||today();
    f.elements.type.value=a?.type||'Ricerca';
    f.elements.title.value=a?.title||'';
    f.elements.details.value=a?.details||'';
    f.elements.nextAction.value=a?.nextAction||'';
    f.elements.nextDate.value=a?.nextDate||'';
    $('#activityDialogTitle').textContent=a?(lang==='it'?'Modifica attività':'Edit activity'):(lang==='it'?'Registra attività':'Add activity');
    $('#activityDialog').showModal();
  }

  function activityFromForm(form){
    const fd=new FormData(form);
    return {
      id:String(fd.get('id')||''),
      date:String(fd.get('date')||today()),
      type:String(fd.get('type')||'Ricerca'),
      title:String(fd.get('title')||'').trim(),
      details:String(fd.get('details')||'').trim(),
      nextAction:String(fd.get('nextAction')||'').trim(),
      nextDate:String(fd.get('nextDate')||'')
    };
  }

  async function saveActivity(inv,form){
    const payload=activityFromForm(form);
    let saved;
    setBusy(lang==='it'?'Salvataggio attività…':'Saving activity…');
    try{
      if(payload.id){
        saved=await Cloud.updateActivity(payload.id,inv.id,payload);
        const idx=inv.activities.findIndex(x=>x.id===payload.id);
        if(idx>=0)inv.activities[idx]=saved;
      }else{
        saved=await Cloud.createActivity(inv.id,payload);
        inv.activities.unshift(saved);
      }

      const investorCopy={...inv};
      if(['Email','Call','Meeting','Follow-up'].includes(saved.type))investorCopy.lastContact=saved.date;
      if(saved.nextAction)investorCopy.nextAction=saved.nextAction;
      if(saved.nextDate)investorCopy.nextDate=saved.nextDate;
      const updated=await Cloud.updateInvestor(inv.id,investorCopy);
      updated.activities=inv.activities;
      Object.assign(inv,updated);

      D.save(db);
      toast(lang==='it'?'Attività salvata.':'Activity saved.','success');
    }finally{clearBusy();}
  }

  async function deleteActivity(inv,id){
    if(!confirm(lang==='it'?'Eliminare questa attività?':'Delete this activity?'))return;
    setBusy(lang==='it'?'Eliminazione attività…':'Deleting activity…');
    try{
      await Cloud.deleteActivity(id);
      inv.activities=inv.activities.filter(a=>a.id!==id);
      D.save(db);
      renderDetail();
    }catch(err){toast(authErrorText(err),'error');}
    finally{clearBusy();}
  }

  function renderDetail(){
    const inv=currentInvestor();
    if(!inv){
      $('.app-main').innerHTML=`<div class="empty">${esc(t('empty.notFound'))}</div>`;
      return;
    }
    document.title=`${inv.name} — Dronepad Investor Hub`;
    $('#detailType').textContent=inv.type;
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
    $('#detailNext').innerHTML=`<strong>${esc(inv.nextAction||'—')}</strong><time>${esc(formatDate(inv.nextDate))}</time>`;
    $('#detailThesis').textContent=inv.thesis||'—';
    $('#detailSource').textContent=inv.source?`${t('form.source')}: ${inv.source}`:'';
    $('#detailNotes').textContent=inv.notes||'—';

    const acts=[...(inv.activities||[])].sort((a,b)=>String(b.date).localeCompare(String(a.date)));
    $('#detailTimeline').innerHTML=acts.length?acts.map(a=>`
      <article class="timeline-item">
        <div class="timeline-date"><b>${esc(formatDate(a.date))}</b><span>${esc(activityLabel(a.type))}</span></div>
        <div class="timeline-copy">
          <h3>${esc(a.title)}</h3><p>${esc(a.details||'')}</p>
          ${a.nextAction?`<div class="timeline-next"><b>${esc(t('form.nextAction'))}:</b> ${esc(a.nextAction)}${a.nextDate?` · ${esc(formatDate(a.nextDate))}`:''}</div>`:''}
        </div>
        <div class="action-row">
          <button class="table-action" data-edit-activity="${esc(a.id)}">${esc(t('actions.edit'))}</button>
          <button class="table-action danger" data-delete-activity="${esc(a.id)}">${esc(t('actions.delete'))}</button>
        </div>
      </article>`).join(''):`<div class="empty">${esc(t('empty.activities'))}</div>`;

    $$('[data-edit-activity]').forEach(b=>b.onclick=()=>openActivity(inv,inv.activities.find(a=>a.id===b.dataset.editActivity)));
    $$('[data-delete-activity]').forEach(b=>b.onclick=()=>deleteActivity(inv,b.dataset.deleteActivity));
    $('#editInvestorBtn').onclick=()=>{fillDetailForm(inv);$('#investorDialog').showModal();};
    $('#deleteInvestorBtn').onclick=()=>removeInvestor(inv,true);
    $('#addActivityBtn').onclick=()=>openActivity(inv);

    const f=$('#investorForm');
    if(!f.dataset.bound){
      f.dataset.bound=1;
      f.addEventListener('submit',async e=>{
        e.preventDefault();
        try{
          await saveInvestorForm(f);
          $('#investorDialog').close();
          renderDetail();
        }catch(err){toast(authErrorText(err),'error');}
      });
    }

    const af=$('#activityForm');
    if(!af.dataset.bound){
      af.dataset.bound=1;
      af.addEventListener('submit',async e=>{
        e.preventDefault();
        try{
          await saveActivity(currentInvestor(),af);
          $('#activityDialog').close();
          renderDetail();
        }catch(err){toast(authErrorText(err),'error');}
      });
    }
  }

  function renderPage(){
    applyTranslations();
    if(page==='home')renderHome();
    else if(page==='pipeline')initPipeline();
    else renderDetail();
  }

  async function boot(){
    initCommon();

    if(!Cloud?.configured){
      createAuthGate();
      $('#authError').textContent=lang==='it'?'Configurazione Supabase non disponibile.':'Supabase configuration unavailable.';
      return;
    }

    try{
      session=await Cloud.getSession();
      if(session){
        await enterApp();
      }else{
        showAuthGate();
      }

      Cloud.onAuthStateChange(async(event,newSession)=>{
        if(event==='SIGNED_OUT'){
          session=null;
          showAuthGate();
          return;
        }
        if(newSession?.user && !session){
          session=newSession;
          await enterApp();
        }
      });
    }catch(err){
      showAuthGate();
      $('#authError').textContent=authErrorText(err);
    }
  }

  boot();
})();