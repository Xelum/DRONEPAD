(() => {
  const cfg = window.DRONEPAD_CONFIG?.supabase || {};
  const isConfigured = Boolean(cfg.enabled && cfg.url && cfg.anonKey && window.supabase?.createClient);
  const client = isConfigured ? window.supabase.createClient(cfg.url, cfg.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  }) : null;

  let projectId = null;
  let user = null;

  async function getSession(){
    if(!client) return {session:null,user:null};
    const { data, error } = await client.auth.getSession();
    if(error) throw error;
    user = data.session?.user || null;
    return {session:data.session,user};
  }

  async function signIn(email,password){
    if(!client) throw new Error('Supabase non configurato.');
    const { data, error } = await client.auth.signInWithPassword({email,password});
    if(error) throw error;
    user = data.user;
    await ensureProject();
    return data;
  }

  async function signOut(){
    if(!client) return;
    const { error } = await client.auth.signOut();
    if(error) throw error;
    user = null;
    projectId = null;
  }

  function onAuthStateChange(cb){
    if(!client) return { data: { subscription: { unsubscribe(){} } } };
    return client.auth.onAuthStateChange(async (event, session) => {
      user = session?.user || null;
      if(user){
        try { await ensureProject(); } catch(e){ console.error(e); }
      } else {
        projectId = null;
      }
      cb?.(event, session);
    });
  }

  async function ensureProject(){
    if(!client || !user) return null;
    if(projectId) return projectId;

    const { data: memberships, error: memberErr } = await client
      .from('project_members')
      .select('project_id, projects!inner(id,name)')
      .eq('user_id', user.id)
      .limit(1);
    if(memberErr) throw memberErr;

    if(memberships?.length){
      projectId = memberships[0].project_id;
      return projectId;
    }

    const { data: project, error: projectErr } = await client
      .from('projects')
      .insert({name:'Dronepad Italy', owner_id:user.id})
      .select('id')
      .single();
    if(projectErr) throw projectErr;

    const { error: membershipErr } = await client
      .from('project_members')
      .insert({project_id:project.id, user_id:user.id, role:'admin'});
    if(membershipErr) throw membershipErr;

    projectId = project.id;
    return projectId;
  }

  async function listRows(table, order='created_at'){
    if(!client || !user) return [];
    const pid = await ensureProject();
    const { data, error } = await client.from(table).select('*').eq('project_id',pid).order(order,{ascending:true});
    if(error) throw error;
    return data || [];
  }

  async function upsertRow(table,row){
    if(!client || !user) return null;
    const pid = await ensureProject();
    const payload = {...row, project_id:pid};
    const { data, error } = await client.from(table).upsert(payload).select('*').single();
    if(error) throw error;
    return data;
  }

  async function insertRows(table, rows){
    if(!client || !user || !rows?.length) return [];
    const pid = await ensureProject();
    const payload = rows.map(row=>({...row,project_id:pid}));
    const { data, error } = await client.from(table).insert(payload).select('*');
    if(error) throw error;
    return data || [];
  }

  async function deleteRow(table,id){
    if(!client || !user) return;
    const pid = await ensureProject();
    const { error } = await client.from(table).delete().eq('project_id',pid).eq('id',id);
    if(error) throw error;
  }

  function safeName(name){
    return String(name || 'file').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/-+/g,'-');
  }


  async function upsertPrototypeItem(itemKey, done){
    if(!client || !user) return null;
    const pid = await ensureProject();
    const { data, error } = await client
      .from('prototype_items')
      .upsert({project_id:pid,item_key:Number(itemKey),done:Boolean(done)},{onConflict:'project_id,item_key'})
      .select('*')
      .single();
    if(error) throw error;
    return data;
  }

  async function uploadDocument(file){
    if(!client || !user) throw new Error('Cloud storage non disponibile.');
    const pid = await ensureProject();
    const bucket = cfg.storageBucket || 'dronepad-documents';
    const storagePath = `${pid}/${user.id}/${Date.now()}-${safeName(file.name)}`;
    const { error: uploadError } = await client.storage.from(bucket).upload(storagePath,file,{upsert:false,cacheControl:'3600'});
    if(uploadError) throw uploadError;

    const { data, error } = await client.from('documents').insert({
      project_id:pid,
      name:file.name,
      mime_type:file.type || 'application/octet-stream',
      size_bytes:file.size,
      storage_path:storagePath,
      category:'Data Room',
      status:'uploaded',
      uploaded_by:user.id
    }).select('*').single();
    if(error) throw error;
    return data;
  }

  async function listDocuments(){
    if(!client || !user) return [];
    return listRows('documents','created_at');
  }

  async function signedDocumentUrl(storagePath, expiresIn=120){
    if(!client) return null;
    const bucket = cfg.storageBucket || 'dronepad-documents';
    const { data, error } = await client.storage.from(bucket).createSignedUrl(storagePath, expiresIn);
    if(error) throw error;
    return data?.signedUrl || null;
  }

  window.DronepadCloud = {
    configured:isConfigured,
    requireAuth:Boolean(cfg.requireAuth),
    client,
    get user(){return user;},
    get projectId(){return projectId;},
    getSession,signIn,signOut,onAuthStateChange,ensureProject,listRows,upsertRow,insertRows,deleteRow,
    uploadDocument,listDocuments,signedDocumentUrl,upsertPrototypeItem
  };
})();
