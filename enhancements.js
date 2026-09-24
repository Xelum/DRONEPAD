
(() => {
  const qs = (s,root=document)=>root.querySelector(s);
  const qsa = (s,root=document)=>[...root.querySelectorAll(s)];

  // ------------------------------------------------------------
  // FINAL COPY EDITOR
  // ------------------------------------------------------------
  const EDIT_STORAGE = 'dronepadHQ_copy_overrides_final';
  let editMode = false;
  let overrides = JSON.parse(localStorage.getItem(EDIT_STORAGE) || '{}');

  const editableSelectors = [
    ['hero-title', '#hero h1'],
    ['hero-body', '#hero .hero-copy > p'],
    ['overview-title', '#overview .section-head h2'],
    ['overview-body', '#overview .section-head > p'],
    ['overview-core-title', '#overview .overview-feature .panel:first-child h3'],
    ['overview-core-body', '#overview .overview-feature .panel:first-child .lead'],
    ['platform-title', '#platform .section-head h2'],
    ['platform-body', '#platform .section-head > p'],
    ['platform-stack-title', '#platform .platform-copy h3'],
    ['platform-stack-body', '#platform .platform-copy p'],
    ['prototype-title', '#prototype .section-head h2'],
    ['prototype-body', '#prototype .section-head > p'],
    ['investors-title', '#investors .page-title h2'],
    ['investors-body', '#investors .page-title p'],
    ['ecosystem-title', '#ecosystem .section-head h2'],
    ['ecosystem-body', '#ecosystem .section-head > p'],
    ['tasks-title', '#tasks .page-title h2'],
    ['tasks-body', '#tasks .page-title p'],
    ['final-title', '#tasks .final-visual h3'],
    ['final-body', '#tasks .final-visual p']
  ];

  function lang(){
    try{return currentLang || 'it'}catch(e){return localStorage.getItem('dronepadHQ_lang') || 'it'}
  }

  function mapEditable(){
    editableSelectors.forEach(([id,sel])=>{
      const el=qs(sel);
      if(el) el.dataset.editId=id;
    });
  }

  function applyOverrides(){
    mapEditable();
    const l=lang();
    const bucket=overrides[l]||{};
    qsa('[data-edit-id]').forEach(el=>{
      const val=bucket[el.dataset.editId];
      if(typeof val==='string' && val.trim()) el.innerHTML=val;
    });
  }

  function saveOverrides(){
    const l=lang();
    overrides[l]=overrides[l]||{};
    qsa('[data-edit-id]').forEach(el=>{
      overrides[l][el.dataset.editId]=el.innerHTML;
    });
    localStorage.setItem(EDIT_STORAGE, JSON.stringify(overrides));
  }

  function setEditMode(on){
    editMode=on;
    document.body.classList.toggle('edit-mode',on);
    qsa('[data-edit-id]').forEach(el=>{
      el.contentEditable=on?'true':'false';
      el.classList.toggle('is-editable',on);
      el.spellcheck=on;
    });
    const btn=qs('#editModeBtn');
    if(btn){
      btn.classList.toggle('editing',on);
      btn.textContent=on?(lang()==='it'?'Salva':'Save'):(lang()==='it'?'Modifica':'Edit');
    }
    if(!on){
      saveOverrides();
      if(typeof showToast==='function') showToast(lang()==='it'?'Modifiche salvate nel workspace.':'Changes saved in the workspace.');
    }
  }

  qs('#editModeBtn')?.addEventListener('click',()=>{
    if(!editMode) applyOverrides();
    setEditMode(!editMode);
  });

  // Re-apply custom copy after a language switch rewrites the translated DOM.
  qsa('#langSwitch button').forEach(btn=>btn.addEventListener('click',()=>{
    setTimeout(()=>{
      applyOverrides();
      if(editMode) setEditMode(true);
      refreshFinalLanguage();
    },30);
  }));

  // ------------------------------------------------------------
  // OPERATING NOTES
  // ------------------------------------------------------------
  const NOTES_KEY='dronepadHQ_project_notes_final';
  const notes=qs('#projectNotes');
  const notesSaved=qs('#notesSaved');
  let notesTimer=null;

  function loadNotes(){
    if(!notes) return;
    const all=JSON.parse(localStorage.getItem(NOTES_KEY)||'{}');
    notes.value=all[lang()]||'';
  }
  function saveNotes(){
    if(!notes) return;
    const all=JSON.parse(localStorage.getItem(NOTES_KEY)||'{}');
    all[lang()]=notes.value;
    localStorage.setItem(NOTES_KEY,JSON.stringify(all));
    notesSaved?.classList.remove('unsaved');
    if(notesSaved) notesSaved.textContent=lang()==='it'?'SALVATO':'SAVED';
  }
  notes?.addEventListener('input',()=>{
    notesSaved?.classList.add('unsaved');
    if(notesSaved) notesSaved.textContent=lang()==='it'?'MODIFICHE…':'CHANGES…';
    clearTimeout(notesTimer);
    notesTimer=setTimeout(saveNotes,450);
  });

  // ------------------------------------------------------------
  // LOCAL PRIVATE DATA ROOM (IndexedDB)
  // ------------------------------------------------------------
  const DB_NAME='dronepadHQ_private_vault';
  const STORE='files';
  let vaultDb=null;

  function openVault(){
    return new Promise((resolve,reject)=>{
      if(vaultDb) return resolve(vaultDb);
      const req=indexedDB.open(DB_NAME,1);
      req.onupgradeneeded=()=>{
        const db=req.result;
        if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE,{keyPath:'id'});
      };
      req.onsuccess=()=>{vaultDb=req.result;resolve(vaultDb)};
      req.onerror=()=>reject(req.error);
    });
  }
  async function vaultPut(file){
    const db=await openVault();
    const item={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name:file.name,type:file.type||'application/octet-stream',size:file.size,createdAt:new Date().toISOString(),blob:file};
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).put(item);
      tx.oncomplete=()=>resolve(item);
      tx.onerror=()=>reject(tx.error);
    });
  }
  async function vaultAll(){
    const db=await openVault();
    return new Promise((resolve,reject)=>{
      const req=db.transaction(STORE,'readonly').objectStore(STORE).getAll();
      req.onsuccess=()=>resolve(req.result||[]);
      req.onerror=()=>reject(req.error);
    });
  }
  async function vaultGet(id){
    const db=await openVault();
    return new Promise((resolve,reject)=>{
      const req=db.transaction(STORE,'readonly').objectStore(STORE).get(id);
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
  }
  async function vaultDelete(id){
    const db=await openVault();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete=resolve;
      tx.onerror=()=>reject(tx.error);
    });
  }
  async function renderVault(){
    try{
      if(typeof cloudMode!=='undefined' && cloudMode) return;
      const root=qs('#uploadedFiles');
      if(!root) return;
      const files=await vaultAll();
      root.innerHTML=files.sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))).map(f=>`
        <div class="uploaded-file">
          <div>
            <strong>${escapeHtml(f.name)}</strong>
            <small>${formatBytes(f.size)} · ${escapeHtml(f.type)}</small>
          </div>
          <div class="local-vault-actions">
            <button type="button" data-vault-open="${f.id}">${lang()==='it'?'Apri':'Open'}</button>
            <button type="button" data-vault-download="${f.id}">${lang()==='it'?'Scarica':'Download'}</button>
            <button type="button" data-vault-delete="${f.id}">${lang()==='it'?'Elimina':'Delete'}</button>
          </div>
        </div>`).join('');
      qsa('[data-vault-open]').forEach(btn=>btn.onclick=async()=>{
        const f=await vaultGet(btn.dataset.vaultOpen);
        if(!f) return;
        const url=URL.createObjectURL(f.blob);
        window.open(url,'_blank','noopener');
        setTimeout(()=>URL.revokeObjectURL(url),60000);
      });
      qsa('[data-vault-download]').forEach(btn=>btn.onclick=async()=>{
        const f=await vaultGet(btn.dataset.vaultDownload);
        if(!f) return;
        const a=document.createElement('a');
        const url=URL.createObjectURL(f.blob);
        a.href=url;a.download=f.name;a.click();
        setTimeout(()=>URL.revokeObjectURL(url),1000);
      });
      qsa('[data-vault-delete]').forEach(btn=>btn.onclick=async()=>{
        await vaultDelete(btn.dataset.vaultDelete);
        await renderVault();
      });
      const note=qs('#storageNote span');
      if(note) note.textContent=lang()==='it'?'Archivio documentale privato attivo su questo dispositivo.':'Private document archive active on this device.';
    }catch(err){
      console.warn('Local vault unavailable',err);
    }
  }

  // Capture local uploads before app.js's cloud-only handler.
  qs('#documentUpload')?.addEventListener('change',async e=>{
    if(typeof cloudMode!=='undefined' && cloudMode) return;
    const file=e.target.files?.[0];
    if(!file) return;
    e.stopImmediatePropagation();
    try{
      await vaultPut(file);
      await renderVault();
      if(typeof showToast==='function') showToast(lang()==='it'?'File aggiunto alla Data Room privata.':'File added to the private Data Room.');
    }catch(err){
      console.error(err);
      if(typeof showToast==='function') showToast(lang()==='it'?'Impossibile salvare il file.':'Unable to save the file.');
    }finally{
      e.target.value='';
    }
  },true);

  // ------------------------------------------------------------
  // MOTION SYSTEM
  // ------------------------------------------------------------
  let headlineObserver=null;
  function setupHeadlines(){
    if(!('IntersectionObserver' in window)) return;
    headlineObserver=headlineObserver||new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-in');
          headlineObserver.unobserve(entry.target);
        }
      })
    },{threshold:.16,rootMargin:'0px 0px -8% 0px'});

    qsa('.section-head h2,.page-title h2,.platform-copy h3,.panel-head h3,.final-visual h3').forEach(el=>{
      if(el.dataset.motionBound==='1') return;
      el.dataset.motionBound='1';
      el.classList.add('motion-title');
      headlineObserver.observe(el);
    });
  }

  // Add an animated border to strategic cards
  function markNeonPanels(){
    qsa('#overview .panel:first-child,#platform .security-card,#investors .panel,#ecosystem .data-room-panel').forEach(el=>el.classList.add('neon-panel'));
  }

  // The base app writes inline transforms to the marquee on scroll.
  // Remove them after each scroll so the continuous CSS marquee stays active.
  function keepMarqueeMoving(){
    const track=qs('#signalTrack');
    if(track) track.style.removeProperty('transform');
  }
  window.addEventListener('scroll',()=>requestAnimationFrame(keepMarqueeMoving),{passive:true});

  // Extra desktop parallax for headline + visual depth.
  let rafPending=false;
  function cinematicScroll(){
    if(rafPending) return;
    rafPending=true;
    requestAnimationFrame(()=>{
      rafPending=false;
      const y=window.scrollY;
      const hero=qs('#hero h1');
      if(hero && innerWidth>980){
        hero.style.transform=`translate3d(0,${Math.min(y*.05,42)}px,0)`;
        hero.style.opacity=String(Math.max(.55,1-y/950));
      }
      qsa('.section-code').forEach((el,i)=>{
        const r=el.parentElement.getBoundingClientRect();
        if(r.top<innerHeight && r.bottom>0){
          el.style.setProperty('--section-shift',`${Math.max(-18,Math.min(18,(innerHeight/2-r.top)*.018))}px`);
        }
      });
    });
  }
  window.addEventListener('scroll',cinematicScroll,{passive:true});

  // ------------------------------------------------------------
  // LANGUAGE-SENSITIVE FINAL UI
  // ------------------------------------------------------------
  function refreshFinalLanguage(){
    const it=lang()==='it';
    const edit=qs('#editModeBtn');
    if(edit && !editMode) edit.textContent=it?'Modifica':'Edit';
    if(qs('#notesTitle')) qs('#notesTitle').textContent=it?'Note operative':'Operating notes';
    if(notes) notes.placeholder=it
      ?'Scrivi qui appunti, decisioni, follow-up, contatti da richiamare, idee per il prototipo o note per il prossimo meeting...'
      :'Write notes, decisions, follow-ups, contacts to call, prototype ideas or points for the next meeting...';
    if(notesSaved) notesSaved.textContent=it?'SALVATO':'SAVED';
    loadNotes();
    renderVault();
  }

  // ------------------------------------------------------------
  // INIT
  // ------------------------------------------------------------
  applyOverrides();
  loadNotes();
  renderVault();
  setupHeadlines();
  markNeonPanels();
  refreshFinalLanguage();
  keepMarqueeMoving();

  // In case app.js redraws translated or dynamic areas after startup.
  setTimeout(()=>{
    applyOverrides();
    setupHeadlines();
    markNeonPanels();
    renderVault();
  },250);
})();
