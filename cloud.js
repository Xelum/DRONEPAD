(() => {
  'use strict';

  const cfg = window.DRONEPAD_SUPABASE || {};
  if (!window.supabase?.createClient) {
    window.DronepadCloud = { configured:false, error:'Supabase library not loaded.' };
    return;
  }
  if (!cfg.url || !cfg.publishableKey) {
    window.DronepadCloud = { configured:false, error:'Missing Supabase configuration.' };
    return;
  }

  const client = window.supabase.createClient(cfg.url, cfg.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  function investorFromRow(r){
    return {
      id:r.id,
      name:r.name || '',
      type:r.type || 'VC',
      stage:r.stage || 'Research',
      priority:r.priority || 'Media',
      contactName:r.contact_name || '',
      contactRole:r.contact_role || '',
      contactEmail:r.contact_email || '',
      contactPhone:r.contact_phone || '',
      website:r.website || '',
      thesis:r.thesis || '',
      source:r.source || '',
      lastContact:r.last_contact || '',
      nextDate:r.next_follow_up || '',
      nextAction:r.next_action || '',
      notes:r.notes || '',
      createdAt:r.created_at || '',
      updatedAt:r.updated_at || '',
      activities:[]
    };
  }

  function investorToRow(x){
    return {
      name:x.name || '',
      type:x.type || 'VC',
      stage:x.stage || 'Research',
      priority:x.priority || 'Media',
      contact_name:x.contactName || null,
      contact_role:x.contactRole || null,
      contact_email:x.contactEmail || null,
      contact_phone:x.contactPhone || null,
      website:x.website || null,
      thesis:x.thesis || null,
      source:x.source || null,
      last_contact:x.lastContact || null,
      next_follow_up:x.nextDate || null,
      next_action:x.nextAction || null,
      notes:x.notes || null
    };
  }

  function activityFromRow(r){
    return {
      id:r.id,
      investorId:r.investor_id,
      date:r.activity_date || '',
      type:r.activity_type || 'Ricerca',
      title:r.title || '',
      details:r.details || '',
      nextAction:r.next_action || '',
      nextDate:r.next_follow_up || '',
      createdAt:r.created_at || '',
      updatedAt:r.updated_at || ''
    };
  }

  function activityToRow(x, investorId){
    return {
      investor_id:investorId,
      activity_date:x.date || new Date().toISOString().slice(0,10),
      activity_type:x.type || 'Ricerca',
      title:x.title || '',
      details:x.details || null,
      next_action:x.nextAction || null,
      next_follow_up:x.nextDate || null
    };
  }

  async function getSession(){
    const {data,error}=await client.auth.getSession();
    if(error) throw error;
    return data.session || null;
  }

  async function signIn(email,password){
    const {data,error}=await client.auth.signInWithPassword({email,password});
    if(error) throw error;
    return data;
  }

  async function signOut(){
    const {error}=await client.auth.signOut();
    if(error) throw error;
  }

  async function loadAll(){
    const invQ = await client.from('investors').select('*').order('created_at',{ascending:true});
    if(invQ.error) throw invQ.error;
    const actQ = await client.from('investor_activities').select('*').order('activity_date',{ascending:false});
    if(actQ.error) throw actQ.error;

    const investors=(invQ.data||[]).map(investorFromRow);
    const map=new Map(investors.map(i=>[i.id,i]));
    (actQ.data||[]).map(activityFromRow).forEach(a=>{
      const inv=map.get(a.investorId);
      if(inv) inv.activities.push(a);
    });
    return {investors};
  }

  async function createInvestor(x){
    const {data,error}=await client.from('investors').insert(investorToRow(x)).select('*').single();
    if(error) throw error;
    return investorFromRow(data);
  }

  async function updateInvestor(id,x){
    const {data,error}=await client.from('investors').update(investorToRow(x)).eq('id',id).select('*').single();
    if(error) throw error;
    return investorFromRow(data);
  }

  async function deleteInvestor(id){
    const {error}=await client.from('investors').delete().eq('id',id);
    if(error) throw error;
  }

  async function createActivity(investorId,x){
    const {data,error}=await client.from('investor_activities').insert(activityToRow(x,investorId)).select('*').single();
    if(error) throw error;
    return activityFromRow(data);
  }

  async function updateActivity(id,investorId,x){
    const {data,error}=await client.from('investor_activities').update(activityToRow(x,investorId)).eq('id',id).select('*').single();
    if(error) throw error;
    return activityFromRow(data);
  }

  async function deleteActivity(id){
    const {error}=await client.from('investor_activities').delete().eq('id',id);
    if(error) throw error;
  }

  async function migrateLocalIfEmpty(localDb){
    const current = await loadAll();
    if(current.investors.length) return {migrated:false, db:current};

    const localInvestors=Array.isArray(localDb?.investors)?localDb.investors:[];
    if(!localInvestors.length) return {migrated:false, db:current};

    for(const local of localInvestors){
      const saved=await createInvestor(local);
      for(const a of (local.activities||[])){
        await createActivity(saved.id,a);
      }
    }
    return {migrated:true, db:await loadAll()};
  }

  function onAuthStateChange(callback){
    return client.auth.onAuthStateChange(callback);
  }

  window.DronepadCloud = {
    configured:true,
    client,
    getSession,
    signIn,
    signOut,
    loadAll,
    createInvestor,
    updateInvestor,
    deleteInvestor,
    createActivity,
    updateActivity,
    deleteActivity,
    migrateLocalIfEmpty,
    onAuthStateChange
  };
})();