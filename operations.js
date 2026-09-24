(() => {
  const ACTIVITY_KEY = 'dronepadHQ_activity_log_v1';
  const STAGE_WEIGHT = {Research:0, Qualified:25, Contacted:45, Meeting:65, 'NDA / DD':85, 'Term Sheet':100};
  const CATEGORY_ORDER = ['Ricerca','Investitore','Contatto','Meeting','Strategia','Competitor','Bando / Finanziamento','Prototipo','Documento','Altro'];

  let activities = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
  let activityCloudReady = false;

  const lang = () => {
    try { return currentLang || 'it'; } catch(e) { return localStorage.getItem('dronepadHQ_lang') || 'it'; }
  };
  const today = () => new Date().toISOString().slice(0,10);
  const parseDate = value => value ? new Date(`${value}T12:00:00`) : null;
  const isoDate = d => d ? new Date(d).toISOString().slice(0,10) : '';
  const daysBetween = (a,b) => Math.floor((b-a)/86400000);
  const fmtDate = value => {
    if(!value) return '—';
    const d=parseDate(value);
    if(!d || Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(lang()==='it'?'it-IT':'en-GB',{day:'2-digit',month:'short',year:'numeric'});
  };
  const esc = value => typeof escapeHtml === 'function' ? escapeHtml(value??'') : String(value??'');
  const safeUrl = value => {
    if(!value) return '';
    try{
      const u=new URL(value,location.href);
      if(!['http:','https:'].includes(u.protocol)) return '';
      return u.href;
    }catch(e){return '';}
  };
  const text = v => {
    try { return textByLang(v); } catch(e) { return typeof v==='object' ? (v?.it||v?.en||'') : (v||''); }
  };

  function normalizeInvestor(x){
    x.priority ||= 'Media';
    x.contactName ||= '';
    x.contactInfo ||= '';
    x.website ||= '';
    x.lastContact ||= '';
    x.nextDate ||= '';
    x.notes ||= {it:'',en:''};
    return x;
  }
  investors.forEach(normalizeInvestor);

  tasks.forEach(t=>{
    t.dueDate ||= '';
    t.owner ||= '';
    t.notes ||= {it:'',en:''};
  });

  function normalizeActivity(x){
    return {
      id:x.id ?? Date.now(),
      date:x.date || today(),
      category:x.category || 'Ricerca',
      entity:x.entity || '',
      outcome:x.outcome || 'Informazione raccolta',
      title:x.title || '',
      details:x.details && typeof x.details==='object' ? x.details : {it:x.details||'',en:x.details||''},
      sourceUrl:x.sourceUrl || '',
      nextAction:x.nextAction && typeof x.nextAction==='object' ? x.nextAction : {it:x.nextAction||'',en:x.nextAction||''},
      nextDate:x.nextDate || '',
      createdAt:x.createdAt || new Date().toISOString(),
      updatedAt:x.updatedAt || new Date().toISOString(),
      system:Boolean(x.system)
    };
  }
  activities = activities.map(normalizeActivity);

  function activityToDb(a){
    const row={
      activity_date:a.date||today(),
      category:a.category||'Ricerca',
      entity:a.entity||'',
      outcome:a.outcome||'',
      title:a.title||'',
      details_it:a.details?.it||'',
      details_en:a.details?.en||a.details?.it||'',
      source_url:a.sourceUrl||'',
      next_action_it:a.nextAction?.it||'',
      next_action_en:a.nextAction?.en||a.nextAction?.it||'',
      next_date:a.nextDate||null,
      system_event:Boolean(a.system)
    };
    if(typeof a.id==='string' && a.id.includes('-')) row.id=a.id;
    return row;
  }
  function activityFromDb(r){
    return normalizeActivity({
      id:r.id,date:r.activity_date,category:r.category,entity:r.entity,outcome:r.outcome,title:r.title,
      details:{it:r.details_it||'',en:r.details_en||r.details_it||''},sourceUrl:r.source_url||'',
      nextAction:{it:r.next_action_it||'',en:r.next_action_en||r.next_action_it||''},nextDate:r.next_date||'',
      createdAt:r.created_at,updatedAt:r.updated_at,system:r.system_event
    });
  }

  async function persistActivity(a){
    if(typeof cloudMode!=='undefined' && cloudMode && window.DronepadCloud?.configured){
      try{
        const saved=await window.DronepadCloud.upsertRow('activity_log',activityToDb(a));
        const mapped=activityFromDb(saved);
        const idx=activities.findIndex(x=>String(x.id)===String(a.id));
        if(idx>=0) activities[idx]=mapped;
        else activities.push(mapped);
        activityCloudReady=true;
      }catch(err){
        console.warn('Activity cloud sync failed',err);
      }
    }
    localStorage.setItem(ACTIVITY_KEY,JSON.stringify(activities));
  }

  async function removeActivity(a){
    if(typeof cloudMode!=='undefined' && cloudMode && window.DronepadCloud?.configured && typeof a.id==='string' && a.id.includes('-')){
      try{ await window.DronepadCloud.deleteRow('activity_log',a.id); }catch(err){ console.warn(err); }
    }
    activities=activities.filter(x=>String(x.id)!==String(a.id));
    localStorage.setItem(ACTIVITY_KEY,JSON.stringify(activities));
    renderActivities();
  }

  async function logSystemActivity({category='Altro',title,entity='',details='',outcome='Informazione raccolta',nextAction='',nextDate=''}) {
    const item=normalizeActivity({
      id:Date.now()+Math.floor(Math.random()*1000),date:today(),category,title,entity,outcome,
      details:{it:details,en:details},nextAction:{it:nextAction,en:nextAction},nextDate,system:true
    });
    activities.push(item);
    await persistActivity(item);
    renderActivities();
  }

  // ------------------------------------------------------------
  // INVESTOR CRM — full CRUD
  // ------------------------------------------------------------
  const originalAddInvestor = addInvestorFromForm;
  addInvestorFromForm = async function(fd){
    const recordId=String(fd.get('recordId')||'').trim();
    const payload={
      name:fd.get('name')||'',
      type:fd.get('type')||'VC',
      fit:{it:fd.get('fit')||'',en:fd.get('fit')||''},
      verification:fd.get('verification')||'To verify',
      stage:fd.get('stage')||'Research',
      next:{it:fd.get('next')||'',en:fd.get('next')||''},
      source:{it:fd.get('source')||'',en:fd.get('source')||''},
      priority:fd.get('priority')||'Media',
      contactName:fd.get('contactName')||'',
      contactInfo:fd.get('contactInfo')||'',
      website:fd.get('website')||'',
      lastContact:fd.get('lastContact')||'',
      nextDate:fd.get('nextDate')||'',
      notes:{it:fd.get('notes')||'',en:fd.get('notes')||''}
    };

    if(recordId){
      const item=investors.find(x=>String(x.id)===recordId);
      if(!item) return;
      const oldStage=item.stage;
      Object.assign(item,payload);
      if(typeof cloudMode!=='undefined' && cloudMode){
        const saved=await window.DronepadCloud.upsertRow('investors',investorToDb(item));
        Object.assign(item,investorFromDb(saved));
      }
      saveInvestors();
      await logSystemActivity({
        category:'Investitore',
        title:`Aggiornato prospect: ${item.name}`,
        entity:item.name,
        details:oldStage!==item.stage?`Stadio: ${oldStage} → ${item.stage}`:'Scheda prospect aggiornata',
        outcome:'Follow-up',
        nextAction:text(item.next),
        nextDate:item.nextDate
      });
      return;
    }

    const item={id:Date.now(),...payload};
    if(typeof cloudMode!=='undefined' && cloudMode){
      const saved=await window.DronepadCloud.upsertRow('investors',investorToDb(item));
      investors.push(investorFromDb(saved));
    }else investors.push(item);
    saveInvestors();
    await logSystemActivity({
      category:'Investitore',
      title:`Nuovo prospect: ${item.name}`,
      entity:item.name,
      details:`Inserito nella pipeline come ${item.type}`,
      outcome:'Informazione raccolta',
      nextAction:text(item.next),
      nextDate:item.nextDate
    });
  };

  function openInvestorEditor(id){
    const item=investors.find(x=>String(x.id)===String(id));
    if(!item) return;
    normalizeInvestor(item);
    const f=document.querySelector('#investorForm');
    f.reset();
    f.elements.recordId.value=item.id;
    f.elements.name.value=item.name||'';
    f.elements.type.value=item.type||'VC';
    f.elements.priority.value=item.priority||'Media';
    f.elements.verification.value=item.verification||'To verify';
    f.elements.stage.value=item.stage||'Research';
    f.elements.contactName.value=item.contactName||'';
    f.elements.contactInfo.value=item.contactInfo||'';
    f.elements.website.value=item.website||'';
    f.elements.lastContact.value=item.lastContact||'';
    f.elements.nextDate.value=item.nextDate||'';
    f.elements.fit.value=text(item.fit);
    f.elements.source.value=text(item.source);
    f.elements.next.value=text(item.next);
    f.elements.notes.value=text(item.notes);
    const title=document.querySelector('#investorDialogTitle');
    if(title) title.textContent=lang()==='it'?'Modifica prospect':'Edit prospect';
    document.querySelector('#investorDialog').showModal();
  }

  async function deleteInvestorRecord(id){
    const item=investors.find(x=>String(x.id)===String(id));
    if(!item) return;
    const ok=confirm(lang()==='it'?`Eliminare ${item.name} dalla pipeline?`:`Delete ${item.name} from the pipeline?`);
    if(!ok) return;
    if(typeof cloudMode!=='undefined' && cloudMode && typeof item.id==='string' && item.id.includes('-')){
      try{await window.DronepadCloud.deleteRow('investors',item.id);}catch(err){showToast(cloudErrorText(err));return;}
    }
    investors=investors.filter(x=>String(x.id)!==String(id));
    localStorage.setItem(STORAGE_KEYS.investors,JSON.stringify(investors));
    renderInvestors();
    await logSystemActivity({
      category:'Investitore',
      title:`Prospect rimosso: ${item.name}`,
      entity:item.name,
      details:'Rimosso dalla pipeline investitori',
      outcome:'Chiuso'
    });
  }

  function priorityClass(v){
    return v==='Alta'?'warn':v==='Bassa'?'neutral':'accent';
  }

  renderInvestors = function(){
    investors.forEach(normalizeInvestor);
    const rows=filteredInvestors();

    const desktop=document.querySelector('#investorRows');
    if(desktop) desktop.innerHTML=rows.map(x=>{
      const site=safeUrl(x.website);
      return `<tr>
        <td>
          <span class="crm-name">${esc(x.name)}</span>
          <span class="crm-sub">${esc(text(x.source)||'—')}</span>
          <span class="crm-thesis">${esc(text(x.fit)||'')}</span>
          ${site?`<a class="crm-link" href="${esc(site)}" target="_blank" rel="noopener">Apri sito ↗</a>`:''}
        </td>
        <td>
          <strong>${esc(x.type)}</strong>
          <div class="crm-inline-tags"><span class="tag ${priorityClass(x.priority)}">${esc(x.priority)}</span><span class="tag ${badgeClass(x.verification)}">${badgeLabel(x.verification)}</span></div>
        </td>
        <td><select class="select-stage" data-stage="${esc(x.id)}">${stageOptions(x)}</select></td>
        <td><span class="date-cell">${fmtDate(x.lastContact)}</span>${x.contactName?`<small>${esc(x.contactName)}</small>`:''}</td>
        <td><strong class="next-action">${esc(text(x.next)||'—')}</strong><small>${x.nextDate?`Entro ${fmtDate(x.nextDate)}`:'Nessuna data'}</small></td>
        <td><div class="row-actions"><button type="button" class="icon-action" data-edit-investor="${esc(x.id)}">Modifica</button><button type="button" class="icon-action danger" data-delete-investor="${esc(x.id)}">Elimina</button></div></td>
      </tr>`;
    }).join('');

    const mobile=document.querySelector('#investorCards');
    if(mobile) mobile.innerHTML=rows.map(x=>`<article class="investor-card">
      <div class="investor-card-head"><div><h4>${esc(x.name)}</h4><small>${esc(x.type)} · ${esc(text(x.source)||'—')}</small></div><span class="tag ${priorityClass(x.priority)}">${esc(x.priority)}</span></div>
      <p>${esc(text(x.fit)||'')}</p>
      <div class="investor-mobile-meta"><span>Ultimo contatto <b>${fmtDate(x.lastContact)}</b></span><span>Follow-up <b>${fmtDate(x.nextDate)}</b></span></div>
      <div class="investor-card-actions"><select class="select-stage" data-stage="${esc(x.id)}">${stageOptions(x)}</select><small>${esc(text(x.next)||'—')}</small></div>
      <div class="row-actions mobile"><button type="button" class="icon-action" data-edit-investor="${esc(x.id)}">Modifica</button><button type="button" class="icon-action danger" data-delete-investor="${esc(x.id)}">Elimina</button></div>
    </article>`).join('');

    document.querySelectorAll('[data-stage]').forEach(sel=>sel.onchange=async()=>{
      const item=investors.find(v=>String(v.id)===String(sel.dataset.stage));
      if(!item) return;
      const previous=item.stage;
      item.stage=sel.value;
      if(item.stage==='Contacted' && !item.lastContact) item.lastContact=today();
      localStorage.setItem(STORAGE_KEYS.investors,JSON.stringify(investors));
      renderInvestors();
      if(typeof cloudMode!=='undefined' && cloudMode){
        try{
          const saved=await window.DronepadCloud.upsertRow('investors',investorToDb(item));
          Object.assign(item,investorFromDb(saved));
          localStorage.setItem(STORAGE_KEYS.investors,JSON.stringify(investors));
        }catch(err){showToast(cloudErrorText(err));}
      }
      if(previous!==item.stage){
        await logSystemActivity({
          category:'Investitore',title:`Pipeline aggiornata: ${item.name}`,entity:item.name,
          details:`${previous} → ${item.stage}`,outcome:'Follow-up',nextAction:text(item.next),nextDate:item.nextDate
        });
      }
    });
    document.querySelectorAll('[data-edit-investor]').forEach(btn=>btn.onclick=()=>openInvestorEditor(btn.dataset.editInvestor));
    document.querySelectorAll('[data-delete-investor]').forEach(btn=>btn.onclick=()=>deleteInvestorRecord(btn.dataset.deleteInvestor));

    const mp=document.querySelector('#metricProspects'); if(mp) mp.textContent=investors.length;
    const mv=document.querySelector('#metricVerified'); if(mv) mv.textContent=metricVerifiedText();
    renderPipeline();
    renderOpsDashboard();
  };

  // Reset the same dialog for a new record.
  document.querySelector('#addInvestorBtn')?.addEventListener('click',()=>{
    const f=document.querySelector('#investorForm');
    setTimeout(()=>{
      f.reset();
      f.elements.recordId.value='';
      if(f.elements.priority) f.elements.priority.value='Media';
      if(f.elements.verification) f.elements.verification.value='To verify';
      if(f.elements.stage) f.elements.stage.value='Research';
      const title=document.querySelector('#investorDialogTitle');
      if(title) title.textContent=lang()==='it'?'Aggiungi prospect':'Add prospect';
    },0);
  });

  // ------------------------------------------------------------
  // TASKS — operational CRUD
  // ------------------------------------------------------------
  const originalAddTask=addTaskFromForm;
  addTaskFromForm = async function(fd){
    const item={
      id:Date.now(),title:{it:fd.get('title')||'',en:fd.get('title')||''},
      stream:fd.get('stream')||'Research',status:fd.get('status')||'Now',
      dueDate:fd.get('dueDate')||'',owner:fd.get('owner')||'',
      notes:{it:fd.get('notes')||'',en:fd.get('notes')||''}
    };
    if(typeof cloudMode!=='undefined' && cloudMode){
      const saved=await window.DronepadCloud.upsertRow('tasks',taskToDb(item));
      tasks.push(taskFromDb(saved));
    }else tasks.push(item);
    saveTasks();
    await logSystemActivity({
      category:'Strategia',title:`Nuovo task: ${text(item.title)}`,entity:item.owner||'',
      details:`Workstream: ${item.stream}`,outcome:'Follow-up',nextAction:text(item.title),nextDate:item.dueDate
    });
  };

  function openTaskEditor(id){
    const item=tasks.find(x=>String(x.id)===String(id));
    if(!item) return;
    const f=document.querySelector('#taskEditForm');
    f.reset();
    f.elements.recordId.value=item.id;
    f.elements.title.value=text(item.title);
    f.elements.stream.value=item.stream||'Research';
    f.elements.status.value=item.status||'Now';
    f.elements.dueDate.value=item.dueDate||'';
    f.elements.owner.value=item.owner||'';
    f.elements.notes.value=text(item.notes);
    document.querySelector('#taskEditDialog').showModal();
  }

  async function saveTaskEdit(fd){
    const id=String(fd.get('recordId')||'');
    const item=tasks.find(x=>String(x.id)===id);
    if(!item) return;
    const oldStatus=item.status;
    item.title={it:fd.get('title')||'',en:fd.get('title')||''};
    item.stream=fd.get('stream')||item.stream;
    item.status=fd.get('status')||item.status;
    item.dueDate=fd.get('dueDate')||'';
    item.owner=fd.get('owner')||'';
    item.notes={it:fd.get('notes')||'',en:fd.get('notes')||''};
    if(typeof cloudMode!=='undefined' && cloudMode){
      const saved=await window.DronepadCloud.upsertRow('tasks',taskToDb(item));
      Object.assign(item,taskFromDb(saved));
    }
    saveTasks();
    if(oldStatus!==item.status){
      await logSystemActivity({
        category:'Strategia',title:`Task aggiornato: ${text(item.title)}`,
        details:`${oldStatus} → ${item.status}`,outcome:item.status==='Done'?'Chiuso':'Follow-up',
        nextAction:item.status==='Done'?'':text(item.title),nextDate:item.dueDate
      });
    }
  }

  async function deleteTaskRecord(id){
    const item=tasks.find(x=>String(x.id)===String(id));
    if(!item) return;
    if(!confirm(lang()==='it'?`Eliminare il task "${text(item.title)}"?`:`Delete task "${text(item.title)}"?`)) return;
    if(typeof cloudMode!=='undefined' && cloudMode && typeof item.id==='string' && item.id.includes('-')){
      try{await window.DronepadCloud.deleteRow('tasks',item.id);}catch(err){showToast(cloudErrorText(err));return;}
    }
    tasks=tasks.filter(x=>String(x.id)!==String(id));
    localStorage.setItem(STORAGE_KEYS.tasks,JSON.stringify(tasks));
    renderTasks();
  }

  renderTasks = function(){
    const root=document.querySelector('#taskBoard');
    if(!root) return;
    root.innerHTML=TASK_STATUSES.map(st=>`<div class="task-column">
      <h3>${tr('misc.taskLabels.'+st)} · ${tasks.filter(x=>x.status===st).length}</h3>
      ${tasks.filter(x=>x.status===st).map(x=>{
        const overdue=x.dueDate && parseDate(x.dueDate)<parseDate(today()) && x.status!=='Done';
        return `<div class="task-card ${overdue?'overdue':''}">
          <div class="task-card-top"><b>${esc(text(x.title))}</b><span class="tag neutral">${esc(x.stream)}</span></div>
          <div class="task-meta">${x.owner?`<span>Responsabile <strong>${esc(x.owner)}</strong></span>`:''}${x.dueDate?`<span>Scadenza <strong>${fmtDate(x.dueDate)}</strong></span>`:''}</div>
          ${text(x.notes)?`<p>${esc(text(x.notes))}</p>`:''}
          <div class="row-actions">
            <button type="button" class="icon-action" data-edit-task="${esc(x.id)}">Modifica</button>
            <button type="button" class="icon-action danger" data-delete-task="${esc(x.id)}">Elimina</button>
          </div>
        </div>`;
      }).join('')}
    </div>`).join('');
    document.querySelectorAll('[data-edit-task]').forEach(btn=>btn.onclick=()=>openTaskEditor(btn.dataset.editTask));
    document.querySelectorAll('[data-delete-task]').forEach(btn=>btn.onclick=()=>deleteTaskRecord(btn.dataset.deleteTask));
    renderOpsDashboard();
  };

  document.querySelector('#saveTaskEdit')?.addEventListener('click',async e=>{
    e.preventDefault();
    const f=document.querySelector('#taskEditForm');
    try{await saveTaskEdit(new FormData(f));f.reset();document.querySelector('#taskEditDialog').close();}catch(err){showToast(cloudErrorText(err));}
  });

  // ------------------------------------------------------------
  // ACTIVITY LOG
  // ------------------------------------------------------------
  function filteredActivities(){
    const q=(document.querySelector('#activitySearch')?.value||'').trim().toLowerCase();
    const cat=document.querySelector('#activityCategoryFilter')?.value||'all';
    const range=document.querySelector('#activityRangeFilter')?.value||'all';
    const now=parseDate(today());
    return [...activities].filter(a=>{
      const hay=`${a.title} ${a.entity} ${text(a.details)} ${a.outcome} ${text(a.nextAction)}`.toLowerCase();
      if(q && !hay.includes(q)) return false;
      if(cat!=='all' && a.category!==cat) return false;
      if(range==='7' || range==='30'){
        const d=parseDate(a.date); if(!d || daysBetween(d,now)>Number(range) || daysBetween(d,now)<0) return false;
      }
      if(range==='upcoming' && !a.nextDate) return false;
      return true;
    }).sort((a,b)=>String(b.date).localeCompare(String(a.date)) || String(b.updatedAt).localeCompare(String(a.updatedAt)));
  }

  function refreshCategoryFilter(){
    const sel=document.querySelector('#activityCategoryFilter');
    if(!sel) return;
    const current=sel.value||'all';
    const cats=[...new Set([...CATEGORY_ORDER,...activities.map(a=>a.category).filter(Boolean)])];
    sel.innerHTML=`<option value="all">${lang()==='it'?'Tutte le categorie':'All categories'}</option>`+
      cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
    sel.value=cats.includes(current)||current==='all'?current:'all';
  }

  function renderActivityTimeline(){
    const root=document.querySelector('#activityTimeline');
    if(!root) return;
    const rows=filteredActivities();
    const count=document.querySelector('#activityCountTag');
    if(count) count.textContent=`${rows.length} ${lang()==='it'?'VOCI':'ITEMS'}`;
    if(!rows.length){
      root.innerHTML=`<div class="empty-state"><strong>${lang()==='it'?'Nessuna attività registrata con questi filtri.':'No activities match these filters.'}</strong><span>${lang()==='it'?'Usa “Registra attività” per aggiungere la prossima ricerca, call o aggiornamento.':'Use “Add activity” to record the next research item, call or update.'}</span></div>`;
      return;
    }
    root.innerHTML=rows.map(a=>{
      const source=safeUrl(a.sourceUrl);
      return `<article class="activity-item">
        <div class="activity-date"><strong>${fmtDate(a.date)}</strong><span>${esc(a.category)}</span></div>
        <div class="activity-content">
          <div class="activity-head"><div><h4>${esc(a.title)}</h4>${a.entity?`<small>${esc(a.entity)}</small>`:''}</div><span class="tag ${a.outcome==='Chiuso'?'good':a.outcome==='Opportunità'?'accent':'neutral'}">${esc(a.outcome)}</span></div>
          ${text(a.details)?`<p>${esc(text(a.details))}</p>`:''}
          <div class="activity-footer">
            ${source?`<a href="${esc(source)}" target="_blank" rel="noopener">Fonte ↗</a>`:''}
            ${text(a.nextAction)?`<span><b>Next:</b> ${esc(text(a.nextAction))}${a.nextDate?` · ${fmtDate(a.nextDate)}`:''}</span>`:''}
          </div>
        </div>
        <div class="row-actions vertical">
          <button type="button" class="icon-action" data-edit-activity="${esc(a.id)}">Modifica</button>
          <button type="button" class="icon-action danger" data-delete-activity="${esc(a.id)}">Elimina</button>
        </div>
      </article>`;
    }).join('');
    document.querySelectorAll('[data-edit-activity]').forEach(btn=>btn.onclick=()=>openActivityEditor(btn.dataset.editActivity));
    document.querySelectorAll('[data-delete-activity]').forEach(btn=>btn.onclick=()=>{
      const a=activities.find(x=>String(x.id)===String(btn.dataset.deleteActivity));
      if(a && confirm(lang()==='it'?`Eliminare "${a.title}" dal registro?`:`Delete "${a.title}" from the log?`)) removeActivity(a);
    });
  }

  function renderActivityStats(){
    const now=parseDate(today());
    const last7=activities.filter(a=>{const d=parseDate(a.date);return d && daysBetween(d,now)>=0 && daysBetween(d,now)<=7;});
    const followups=activities.filter(a=>a.nextDate || text(a.nextAction));
    const sources=new Set(activities.map(a=>safeUrl(a.sourceUrl)).filter(Boolean));
    const set=(id,val)=>{const el=document.querySelector(id);if(el)el.textContent=val;};
    set('#activityTotal',activities.length);set('#activityWeek',last7.length);set('#activityFollowups',followups.length);set('#activitySources',sources.size);

    const weekly=document.querySelector('#weeklySummary');
    if(weekly){
      const opp=last7.filter(a=>a.outcome==='Opportunità').length;
      const meetings=last7.filter(a=>a.category==='Meeting'||a.category==='Contatto').length;
      weekly.innerHTML=`<div><span>Attività</span><b>${last7.length}</b></div><div><span>Contatti / meeting</span><b>${meetings}</b></div><div><span>Opportunità</span><b>${opp}</b></div><div><span>Follow-up</span><b>${last7.filter(a=>a.nextDate||text(a.nextAction)).length}</b></div>`;
    }

    const catRoot=document.querySelector('#categoryBreakdown');
    if(catRoot){
      const counts={};activities.forEach(a=>counts[a.category]=(counts[a.category]||0)+1);
      const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,7);
      catRoot.innerHTML=entries.length?entries.map(([k,v])=>`<div><span>${esc(k)}</span><b>${v}</b></div>`).join(''):`<div class="empty-mini">Nessun dato ancora.</div>`;
    }
  }

  function renderResourceLibrary(){
    const root=document.querySelector('#resourceLibrary');
    if(!root) return;
    const map=new Map();
    activities.forEach(a=>{
      const url=safeUrl(a.sourceUrl);
      if(url && !map.has(url)) map.set(url,{url,title:a.title,category:a.category,date:a.date,entity:a.entity});
    });
    investors.forEach(i=>{
      const url=safeUrl(i.website);
      if(url && !map.has(url)) map.set(url,{url,title:i.name,category:'Investitore',date:i.lastContact||'',entity:i.type});
    });
    const items=[...map.values()].sort((a,b)=>String(b.date).localeCompare(String(a.date)));
    const tag=document.querySelector('#resourceCountTag');if(tag)tag.textContent=`${items.length} LINK`;
    root.innerHTML=items.length?items.map(r=>`<a class="resource-item" href="${esc(r.url)}" target="_blank" rel="noopener"><div><strong>${esc(r.title)}</strong><small>${esc(r.category)}${r.entity?` · ${esc(r.entity)}`:''}</small></div><span>↗</span></a>`).join(''):`<div class="empty-state compact"><strong>Nessun link salvato.</strong><span>I link inseriti nel Registro o nelle schede investitore appariranno qui automaticamente.</span></div>`;
  }

  function openActivityEditor(id){
    const a=activities.find(x=>String(x.id)===String(id));
    if(!a) return;
    const f=document.querySelector('#activityForm');f.reset();
    f.elements.recordId.value=a.id;
    f.elements.date.value=a.date||today();
    f.elements.category.value=a.category||'Ricerca';
    f.elements.entity.value=a.entity||'';
    f.elements.outcome.value=a.outcome||'Informazione raccolta';
    f.elements.title.value=a.title||'';
    f.elements.details.value=text(a.details);
    f.elements.sourceUrl.value=a.sourceUrl||'';
    f.elements.nextAction.value=text(a.nextAction);
    f.elements.nextDate.value=a.nextDate||'';
    document.querySelector('#activityDialogTitle').textContent=lang()==='it'?'Modifica attività':'Edit activity';
    document.querySelector('#activityDialog').showModal();
  }

  async function saveActivityForm(fd){
    const id=String(fd.get('recordId')||'');
    let a=id?activities.find(x=>String(x.id)===id):null;
    const fresh=!a;
    if(!a) a=normalizeActivity({id:Date.now()+Math.floor(Math.random()*1000)});
    a.date=fd.get('date')||today();
    a.category=fd.get('category')||'Ricerca';
    a.entity=fd.get('entity')||'';
    a.outcome=fd.get('outcome')||'Informazione raccolta';
    a.title=fd.get('title')||'';
    a.details={it:fd.get('details')||'',en:fd.get('details')||''};
    a.sourceUrl=fd.get('sourceUrl')||'';
    a.nextAction={it:fd.get('nextAction')||'',en:fd.get('nextAction')||''};
    a.nextDate=fd.get('nextDate')||'';
    a.updatedAt=new Date().toISOString();
    if(fresh) activities.push(a);
    await persistActivity(a);
    renderActivities();
  }

  function renderActivities(){
    refreshCategoryFilter();
    renderActivityTimeline();
    renderActivityStats();
    renderResourceLibrary();
    renderOpsDashboard();
  }

  document.querySelector('#addActivityBtn')?.addEventListener('click',()=>{
    const f=document.querySelector('#activityForm');f.reset();f.elements.recordId.value='';f.elements.date.value=today();
    document.querySelector('#activityDialogTitle').textContent=lang()==='it'?'Registra attività':'Add activity';
    document.querySelector('#activityDialog').showModal();
  });
  document.querySelector('#saveActivity')?.addEventListener('click',async e=>{
    e.preventDefault();
    const f=document.querySelector('#activityForm');
    try{await saveActivityForm(new FormData(f));f.reset();document.querySelector('#activityDialog').close();}catch(err){showToast(String(err?.message||err));}
  });
  ['#activitySearch','#activityCategoryFilter','#activityRangeFilter'].forEach(sel=>{
    const el=document.querySelector(sel); if(!el) return;
    el.addEventListener(el.tagName==='INPUT'?'input':'change',()=>renderActivityTimeline());
  });

  // ------------------------------------------------------------
  // AUTOMATED PROJECT DASHBOARD
  // ------------------------------------------------------------
  function collectUpcoming(){
    const now=parseDate(today());
    const horizon=new Date(now);horizon.setDate(horizon.getDate()+14);
    const items=[];
    investors.forEach(i=>{if(i.nextDate){const d=parseDate(i.nextDate);if(d && d>=now && d<=horizon)items.push({date:i.nextDate,title:i.name,kind:'Investitore',action:text(i.next)});}});
    tasks.forEach(t=>{if(t.dueDate && t.status!=='Done'){const d=parseDate(t.dueDate);if(d && d>=now && d<=horizon)items.push({date:t.dueDate,title:text(t.title),kind:'Task',action:t.owner||''});}});
    activities.forEach(a=>{if(a.nextDate){const d=parseDate(a.nextDate);if(d && d>=now && d<=horizon)items.push({date:a.nextDate,title:a.title,kind:'Follow-up',action:text(a.nextAction)});}});
    return items.sort((a,b)=>a.date.localeCompare(b.date));
  }

  function calculateOpsIndex(){
    const proto=protoState.length?protoState.filter(Boolean).length/protoState.length*100:0;
    const task=tasks.length?tasks.filter(t=>t.status==='Done').length/tasks.length*100:0;
    const investor=investors.length?investors.reduce((sum,i)=>sum+(STAGE_WEIGHT[i.stage]||0),0)/investors.length:0;
    return {proto,task,investor,total:Math.round(proto*.45+task*.35+investor*.20)};
  }

  function renderOpsDashboard(){
    const root=document.querySelector('#opsDashboard');
    if(!root) return;
    const idx=calculateOpsIndex();
    const ring=document.querySelector('#opsIndexRing');
    if(ring) ring.style.setProperty('--progress',`${idx.total*3.6}deg`);
    const val=document.querySelector('#opsIndexValue');if(val)val.textContent=`${idx.total}%`;

    const now=parseDate(today());
    const week=activities.filter(a=>{const d=parseDate(a.date);return d && daysBetween(d,now)>=0 && daysBetween(d,now)<=7;}).length;
    const advanced=investors.filter(i=>i.stage!=='Research').length;
    const done=tasks.filter(t=>t.status==='Done').length;
    const up=collectUpcoming();

    const set=(id,v)=>{const el=document.querySelector(id);if(el)el.textContent=v;};
    set('#opsWeekActivities',week);set('#opsAdvancedInvestors',advanced);set('#opsTaskRatio',`${done}/${tasks.length}`);set('#opsUpcoming',up.length);

    const last=[...activities].sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)))[0];
    set('#opsLastUpdate',lang()==='it'?`Ultimo aggiornamento: ${last?fmtDate(last.date):'nessuna attività registrata'}`:`Last update: ${last?fmtDate(last.date):'no activity recorded'}`);

    const recent=document.querySelector('#recentActivityList');
    if(recent){
      const list=[...activities].sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,5);
      recent.innerHTML=list.length?list.map(a=>`<div class="recent-row"><span class="date-dot"></span><div><b>${esc(a.title)}</b><small>${fmtDate(a.date)} · ${esc(a.category)}${a.entity?` · ${esc(a.entity)}`:''}</small></div></div>`).join(''):`<div class="empty-state compact"><strong>Il registro è pronto.</strong><span>Aggiungi la prima ricerca o attività per popolare automaticamente questa dashboard.</span></div>`;
    }

    const upcoming=document.querySelector('#upcomingList');
    if(upcoming){
      upcoming.innerHTML=up.length?up.slice(0,6).map(x=>`<div class="upcoming-row"><time>${fmtDate(x.date)}</time><div><b>${esc(x.title)}</b><small>${esc(x.kind)}${x.action?` · ${esc(x.action)}`:''}</small></div></div>`).join(''):`<div class="empty-state compact"><strong>Nessuna scadenza nei prossimi 14 giorni.</strong><span>Aggiungi date di follow-up a task, attività o prospect.</span></div>`;
    }
  }

  const oldUpdatePrototype=updatePrototypePct;
  updatePrototypePct=function(){oldUpdatePrototype();renderOpsDashboard();};

  // Wrap save functions so dashboard always refreshes.
  const oldSaveTasks=saveTasks;
  saveTasks=function(){oldSaveTasks();renderOpsDashboard();};
  const oldSaveInvestors=saveInvestors;
  saveInvestors=function(rerender=true){oldSaveInvestors(rerender);renderOpsDashboard();renderResourceLibrary();};

  // ------------------------------------------------------------
  // Cloud activity sync
  // ------------------------------------------------------------
  async function loadCloudActivities(){
    if(!(window.DronepadCloud?.configured)) return;
    try{
      const {user}=await window.DronepadCloud.getSession();
      if(!user) return;
      const rows=await window.DronepadCloud.listRows('activity_log','activity_date');
      activities=rows.map(activityFromDb);
      localStorage.setItem(ACTIVITY_KEY,JSON.stringify(activities));
      activityCloudReady=true;
      renderActivities();
    }catch(err){
      console.warn('Activity log cloud table not available yet',err);
    }
  }
  window.DronepadCloud?.onAuthStateChange?.((_event,session)=>{if(session?.user)setTimeout(loadCloudActivities,150);});


  // ------------------------------------------------------------
  // IT / EN labels for the operational sections
  // ------------------------------------------------------------
  function refreshOpsLanguage(){
    const en=lang()==='en';
    const setText=(sel,it,enText)=>{const el=document.querySelector(sel);if(el)el.textContent=en?enText:it;};
    const setHtml=(sel,it,enText)=>{const el=document.querySelector(sel);if(el)el.innerHTML=en?enText:it;};

    setText('#research .eyebrow','REGISTRO DI PROGETTO','PROJECT LOG');
    setHtml('#research .page-title h2','RICERCHE, CONTATTI<br><span class="neon-word">E RISULTATI.</span>','RESEARCH, CONTACTS<br><span class="neon-word">AND RESULTS.</span>');
    setText('#research .page-title p',
      'Ogni ricerca, sito analizzato, contatto, meeting o decisione viene registrato con data, fonte, risultato e prossima azione.',
      'Every research item, website, contact, meeting or decision is recorded with date, source, outcome and next action.'
    );
    setText('#addActivityBtn','+ Registra attività','+ Add activity');

    const kpis=document.querySelectorAll('#research .mini-op-card');
    const labels=en
      ? [['TOTAL ACTIVITIES','items recorded'],['LAST 7 DAYS','new updates'],['WITH FOLLOW-UP','future actions planned'],['SAVED SOURCES','websites and references']]
      : [['ATTIVITÀ TOTALI','voci registrate'],['ULTIMI 7 GIORNI','nuovi aggiornamenti'],['CON FOLLOW-UP','azioni future pianificate'],['FONTI SALVATE','siti e riferimenti']];
    kpis.forEach((card,i)=>{if(labels[i]){card.querySelector('span').textContent=labels[i][0];card.querySelector('small').textContent=labels[i][1];}});

    const search=document.querySelector('#activitySearch');if(search)search.placeholder=en?'Search title, organisation, notes or outcome...':'Cerca titolo, organizzazione, note o risultato...';
    const range=document.querySelector('#activityRangeFilter');
    if(range)range.innerHTML=en
      ? '<option value="all">All time</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="upcoming">With next due date</option>'
      : '<option value="all">Tutto il periodo</option><option value="7">Ultimi 7 giorni</option><option value="30">Ultimi 30 giorni</option><option value="upcoming">Con prossima scadenza</option>';

    const mainLog=document.querySelector('#research .activity-layout > .panel');
    if(mainLog){
      mainLog.querySelector('.kicker').textContent='TIMELINE';
      mainLog.querySelector('h3').textContent=en?'Activity log':'Registro attività';
    }
    const sidePanels=document.querySelectorAll('#research .activity-side .panel');
    if(sidePanels[0]){
      sidePanels[0].querySelector('.kicker').textContent=en?'AUTOMATIC SUMMARY':'RIEPILOGO AUTOMATICO';
      sidePanels[0].querySelector('h3').textContent=en?'This week':'Questa settimana';
    }
    if(sidePanels[1]){
      sidePanels[1].querySelector('.kicker').textContent=en?'CATEGORIES':'CATEGORIE';
      sidePanels[1].querySelector('h3').textContent=en?'Where you are working':'Dove stai lavorando';
    }

    setText('#ecosystem .eyebrow','ARCHIVIO DI PROGETTO','PROJECT ARCHIVE');
    setHtml('#ecosystem .section-head h2','DOCUMENTI, FONTI<br><span class="neon-word">E RIFERIMENTI.</span>','DOCUMENTS, SOURCES<br><span class="neon-word">AND REFERENCES.</span>');
    setText('#ecosystem .section-head p',
      'Tutto ciò che supporta il lavoro resta ordinato e recuperabile: documenti riservati, presentazioni, brevetti, siti studiati e fonti utilizzate.',
      'Everything supporting the work stays organised and retrievable: confidential documents, presentations, patents, researched websites and sources.'
    );

    const th=document.querySelectorAll('#investors .crm-table thead th');
    const thLab=en?['Prospect','Type','Stage','Last contact','Next action','Actions']:['Prospect','Tipo','Stadio','Ultimo contatto','Prossima azione','Azioni'];
    th.forEach((el,i)=>{if(thLab[i])el.textContent=thLab[i];});

    setText('#tasks .page-title .eyebrow','EXECUTION BOARD','EXECUTION BOARD');
    setHtml('#tasks .page-title h2','PIANO DI<br><span class="neon-word">LAVORO.</span>','WORK<br><span class="neon-word">PLAN.</span>');
    setText('#tasks .page-title p',
      'Task, scadenze e priorità operative: qui si vede cosa è in corso, cosa viene dopo e cosa è stato completato.',
      'Tasks, deadlines and priorities: see what is in progress, what comes next and what has been completed.'
    );

    const notesTitle=document.querySelector('#notesTitle');if(notesTitle)notesTitle.textContent=en?'Operating notes':'Note operative';
  }

  // Language refresh
  document.querySelectorAll('#langSwitch button').forEach(btn=>btn.addEventListener('click',()=>{
    setTimeout(()=>{
      renderInvestors();renderTasks();refreshOpsLanguage();renderActivities();
    },40);
  }));


  let blueNeonRaf=false;
  window.addEventListener('scroll',()=>{
    if(blueNeonRaf) return;
    blueNeonRaf=true;
    requestAnimationFrame(()=>{
      blueNeonRaf=false;
      const y=window.scrollY;
      const a=document.querySelector('.blue-orb.orb-a');
      const b=document.querySelector('.blue-orb.orb-b');
      const c=document.querySelector('.blue-orb.orb-c');
      if(a) a.style.marginTop=`${Math.min(70,y*.016)}px`;
      if(b) b.style.marginTop=`${Math.max(-75,-y*.011)}px`;
      if(c) c.style.marginLeft=`${Math.sin(y/720)*20}px`;
    });
  },{passive:true});

  // Initial rendering
  renderInvestors();
  renderTasks();
  refreshOpsLanguage();
  renderActivities();
  renderOpsDashboard();
  setTimeout(loadCloudActivities,350);
})();