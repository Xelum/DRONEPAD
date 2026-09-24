(() => {
  const STORAGE_KEY = 'dronepadInvestorHub_v1';
  const LANG_KEY = 'dronepadInvestorHub_lang';
  const STAGES = ['Research','Qualified','Contacted','Meeting','NDA / DD','Term Sheet'];
  const TYPES = ['VC','Corporate VC','Family Office','Incubator / Accelerator','Technology Transfer','Public / Export Finance','Advisor','Industrial Partner','Corporate / Strategic Partner'];
  const PRIORITIES = ['Alta','Media','Bassa'];
  const ACTIVITY_TYPES = ['Ricerca','Email','Call','Meeting','Follow-up','Nota'];

  const seed = {
    version: 1,
    investors: [
      {id:'inv-algebris',name:'Algebris Climatech',type:'VC',stage:'Research',priority:'Alta',thesis:'Ha già investito nel settore drone/deep-tech e può essere un interlocutore coerente con una proposta infrastrutturale ad alto contenuto tecnologico.',source:'Ricerca iniziale / ecosistema Dronus',website:'https://www.algebris.com/',contactName:'',contactRole:'',contactEmail:'',contactPhone:'',lastContact:'',nextDate:'',nextAction:'Individuare il referente corretto del team Climatech e preparare un teaser dedicato.',notes:'',createdAt:'2026-09-24T10:00:00.000Z',updatedAt:'2026-09-24T10:00:00.000Z',activities:[{id:'a1',date:'2026-09-24',type:'Ricerca',title:'Inserimento prospect',details:'Aggiunto alla pipeline per approfondimento del team Climatech e del relativo focus di investimento.',nextAction:'Individuare referente corretto',nextDate:'',createdAt:'2026-09-24T10:00:00.000Z'}]},
      {id:'inv-cdp',name:'CDP Venture Capital',type:'VC',stage:'Research',priority:'Alta',thesis:'Potenziale interlocutore per deep-tech, aerospace, technology transfer e strumenti di co-investimento.',source:'Ricerca iniziale / Galaxia',website:'https://www.cdpventurecapital.it/',contactName:'',contactRole:'',contactEmail:'',contactPhone:'',lastContact:'',nextDate:'',nextAction:'Capire quale fondo o programma sia più coerente con Dronepad.',notes:'',createdAt:'2026-09-24T10:05:00.000Z',updatedAt:'2026-09-24T10:05:00.000Z',activities:[]},
      {id:'inv-eninext',name:'Eni Next',type:'Corporate VC',stage:'Research',priority:'Media',thesis:'Da esplorare per possibili connessioni con energia, infrastrutture, sicurezza, ispezioni e logistica.',source:'Ricerca iniziale / corporate venturing',website:'https://www.eni.com/',contactName:'',contactRole:'',contactEmail:'',contactPhone:'',lastContact:'',nextDate:'',nextAction:'Definire use case industriali compatibili con la tesi del corporate venture.',notes:'',createdAt:'2026-09-24T10:10:00.000Z',updatedAt:'2026-09-24T10:10:00.000Z',activities:[]},
      {id:'inv-polihub',name:'PoliHub / Poli360',type:'Incubator / Accelerator',stage:'Qualified',priority:'Media',thesis:'Può essere utile per validazione, networking, introduzioni a investitori e strutturazione del percorso.',source:'Ricerca iniziale',website:'https://polihub.it/',contactName:'',contactRole:'',contactEmail:'',contactPhone:'',lastContact:'',nextDate:'',nextAction:'Verificare modalità di accesso e interlocutore più adatto.',notes:'',createdAt:'2026-09-24T10:15:00.000Z',updatedAt:'2026-09-24T10:15:00.000Z',activities:[]},
      {id:'inv-galaxia',name:'Galaxia',type:'Technology Transfer',stage:'Qualified',priority:'Alta',thesis:'Programma particolarmente interessante per la componente aerospace e per il passaggio da tecnologia protetta a proof-of-concept.',source:'Ricerca iniziale',website:'https://www.cdpventurecapital.it/',contactName:'',contactRole:'',contactEmail:'',contactPhone:'',lastContact:'',nextDate:'',nextAction:'Studiare requisiti, finestre e soggetti partner del programma.',notes:'',createdAt:'2026-09-24T10:20:00.000Z',updatedAt:'2026-09-24T10:20:00.000Z',activities:[]}
    ]
  };

  const i18n = {
    it: {
      nav:{home:'Hub',dashboard:'Dashboard',pipeline:'Pipeline investitori'},
      actions:{backup:'Backup dati',addInvestor:'+ Aggiungi prospect',edit:'Modifica',delete:'Elimina',cancel:'Annulla',save:'Salva',open:'Apri scheda',addActivity:'+ Registra attività'},
      home:{eyebrow:'DRONEPAD / INVESTOR HUB',title:'DRONEPAD.<br><span class="neon-text">INVESTOR HUB.</span>',intro:'Un hub semplice, visivo e operativo per seguire la ricerca investitori, mostrare l\'avanzamento del lavoro e aprire in dettaglio ogni prospect.',cta:'Apri pipeline',secondary:'Vedi stato pipeline',point1:'Home centrale del progetto',point2:'Pipeline investitori in dettaglio',point3:'Contatti, follow-up e risultati',visualCaption:'Visione Dronepad',visualText:'Tecnologia, infrastruttura, capitale.',introKicker:'INTRODUZIONE',introTitle:'Una piattaforma pensata per lavorare davvero.',introText:'La home racconta il progetto in pochi secondi. La pipeline raccoglie tutto ciò che serve per la ricerca investitori: prospect, contatti, attività, scadenze e prossime mosse.'},
      dashboard:{eyebrow:'STATO DEL LAVORO',title:'PANORAMICA<br><span class="neon-text">INVESTITORI.</span>',intro:'Una vista rapida per capire quanti prospect stiamo studiando, quanti sono avanzati e quali follow-up richiedono attenzione.',openPipeline:'Apri pipeline',funnelKicker:'PIPELINE',funnelTitle:'Distribuzione per stadio',nextKicker:'PROSSIME AZIONI',nextTitle:'Follow-up in agenda',manage:'Gestisci ↗',activityKicker:'ATTIVITÀ RECENTE',activityTitle:'Cosa è stato fatto'},
      pipeline:{eyebrow:'CRM INVESTITORI',title:'PIPELINE<br><span class="neon-text">INVESTITORI.</span>',intro:'Ogni prospect ha uno stadio, una priorità, una cronologia e una prossima azione. Clicca sul nome per aprire la scheda completa.',listKicker:'PROSPECT',listTitle:'Elenco investitori'},
      table:{name:'Prospect',type:'Tipo',stage:'Stadio',priority:'Priorità',last:'Ultimo contatto',next:'Prossima azione',actions:'Azioni'},
      form:{name:'Nome',type:'Tipo',stage:'Stadio',priority:'Priorità',contactName:'Referente',contactRole:'Ruolo',phone:'Telefono',website:'Sito / Link',lastContact:'Ultimo contatto',nextDate:'Prossimo follow-up',thesis:'Perché è rilevante / tesi',source:'Fonte',nextAction:'Prossima azione',notes:'Note interne'},
      detail:{back:'← Torna alla pipeline',overviewKicker:'SCHEDA',overviewTitle:'Informazioni principali',nextKicker:'FOLLOW-UP',nextTitle:'Prossima azione',thesisKicker:'TESI',thesisTitle:'Perché è rilevante',activityKicker:'CRONOLOGIA',activityTitle:'Attività e contatti',notesKicker:'NOTE',notesTitle:'Note interne'},
      activity:{date:'Data',type:'Tipo',title:'Titolo',details:'Dettagli'},
      stages:{Research:'Ricerca',Qualified:'Qualificato',Contacted:'Contattato',Meeting:'Meeting','NDA / DD':'NDA / DD','Term Sheet':'Term Sheet'},
      priority:{Alta:'Alta',Media:'Media',Bassa:'Bassa'},
      metric:{total:'Prospect totali',advanced:'Oltre la ricerca',contacted:'Contattati / meeting',followups:'Follow-up aperti'},
      empty:{followups:'Nessun follow-up con data impostata.',activities:'Nessuna attività registrata.',pipeline:'Nessun prospect corrisponde ai filtri.',notFound:'Investitore non trovato.'}
    },
    en: {
      nav:{home:'Hub',dashboard:'Dashboard',pipeline:'Investor pipeline'},
      actions:{backup:'Data backup',addInvestor:'+ Add prospect',edit:'Edit',delete:'Delete',cancel:'Cancel',save:'Save',open:'Open record',addActivity:'+ Add activity'},
      home:{eyebrow:'DRONEPAD / INVESTOR HUB',title:'DRONEPAD.<br><span class="neon-text">INVESTOR HUB.</span>',intro:'A simple, visual and operational hub to manage investor research, show progress and open every prospect in detail.',cta:'Open pipeline',secondary:'View pipeline status',point1:'Central project home',point2:'Detailed investor pipeline',point3:'Contacts, follow-ups and results',visualCaption:'Dronepad vision',visualText:'Technology, infrastructure, capital.',introKicker:'INTRODUCTION',introTitle:'A platform designed for real work.',introText:'The home explains the project in seconds. The pipeline contains everything needed for investor research: prospects, contacts, activities, deadlines and next moves.'},
      dashboard:{eyebrow:'WORK STATUS',title:'INVESTOR<br><span class="neon-text">OVERVIEW.</span>',intro:'A quick view of how many prospects are being researched, how many have advanced and which follow-ups require attention.',openPipeline:'Open pipeline',funnelKicker:'PIPELINE',funnelTitle:'Stage distribution',nextKicker:'NEXT ACTIONS',nextTitle:'Upcoming follow-ups',manage:'Manage ↗',activityKicker:'RECENT ACTIVITY',activityTitle:'What has been done'},
      pipeline:{eyebrow:'INVESTOR CRM',title:'INVESTOR<br><span class="neon-text">PIPELINE.</span>',intro:'Every prospect has a stage, priority, activity history and next action. Click a name to open the complete record.',listKicker:'PROSPECTS',listTitle:'Investor list'},
      table:{name:'Prospect',type:'Type',stage:'Stage',priority:'Priority',last:'Last contact',next:'Next action',actions:'Actions'},
      form:{name:'Name',type:'Type',stage:'Stage',priority:'Priority',contactName:'Contact person',contactRole:'Role',phone:'Phone',website:'Website / Link',lastContact:'Last contact',nextDate:'Next follow-up',thesis:'Why it matters / thesis',source:'Source',nextAction:'Next action',notes:'Internal notes'},
      detail:{back:'← Back to pipeline',overviewKicker:'RECORD',overviewTitle:'Key information',nextKicker:'FOLLOW-UP',nextTitle:'Next action',thesisKicker:'THESIS',thesisTitle:'Why it matters',activityKicker:'HISTORY',activityTitle:'Activities and contacts',notesKicker:'NOTES',notesTitle:'Internal notes'},
      activity:{date:'Date',type:'Type',title:'Title',details:'Details'},
      stages:{Research:'Research',Qualified:'Qualified',Contacted:'Contacted',Meeting:'Meeting','NDA / DD':'NDA / DD','Term Sheet':'Term Sheet'},
      priority:{Alta:'High',Media:'Medium',Bassa:'Low'},
      metric:{total:'Total prospects',advanced:'Beyond research',contacted:'Contacted / meetings',followups:'Open follow-ups'},
      empty:{followups:'No follow-up date set.',activities:'No activity recorded.',pipeline:'No prospects match the filters.',notFound:'Investor not found.'}
    }
  };

  const clone=v=>JSON.parse(JSON.stringify(v));
  function load(){try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw){const fresh=clone(seed);localStorage.setItem(STORAGE_KEY,JSON.stringify(fresh));return fresh;}const parsed=JSON.parse(raw);if(!Array.isArray(parsed.investors))throw new Error('Invalid');return parsed;}catch(e){const fresh=clone(seed);localStorage.setItem(STORAGE_KEY,JSON.stringify(fresh));return fresh;}}
  function save(data){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}
  function uid(prefix='id'){return window.crypto?.randomUUID?`${prefix}-${crypto.randomUUID()}`:`${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;}
  function getLang(){const v=localStorage.getItem(LANG_KEY);return v==='en'?'en':'it';}
  function setLang(v){localStorage.setItem(LANG_KEY,v==='en'?'en':'it');}
  window.DronepadData={STORAGE_KEY,LANG_KEY,STAGES,TYPES,PRIORITIES,ACTIVITY_TYPES,i18n,load,save,uid,getLang,setLang};
})();
