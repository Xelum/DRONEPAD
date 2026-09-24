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
      {
        id:'inv-algebris',
        name:'Algebris Climatech',
        type:'VC',
        stage:'Research',
        priority:'Alta',
        thesis:'Ha già investito nel settore drone/deep-tech e può essere un interlocutore coerente con una proposta infrastrutturale ad alto contenuto tecnologico.',
        source:'Ricerca iniziale / ecosistema Dronus',
        website:'https://www.algebris.com/',
        contactName:'',
        contactRole:'',
        contactEmail:'',
        contactPhone:'',
        lastContact:'',
        nextDate:'',
        nextAction:'Individuare il referente corretto del team Climatech e preparare un teaser dedicato.',
        notes:'',
        createdAt:'2026-09-24T10:00:00.000Z',
        updatedAt:'2026-09-24T10:00:00.000Z',
        activities:[
          {id:'a1',date:'2026-09-24',type:'Ricerca',title:'Inserimento prospect',details:'Aggiunto alla pipeline per approfondimento del team Climatech e del relativo focus di investimento.',nextAction:'Individuare referente corretto',nextDate:'',createdAt:'2026-09-24T10:00:00.000Z'}
        ]
      },
      {
        id:'inv-cdp',
        name:'CDP Venture Capital',
        type:'VC',
        stage:'Research',
        priority:'Alta',
        thesis:'Potenziale interlocutore per deep-tech, aerospace, technology transfer e strumenti di co-investimento.',
        source:'Ricerca iniziale / Galaxia',
        website:'https://www.cdpventurecapital.it/',
        contactName:'',
        contactRole:'',
        contactEmail:'',
        contactPhone:'',
        lastContact:'',
        nextDate:'',
        nextAction:'Capire quale fondo o programma sia più coerente con Dronepad.',
        notes:'',
        createdAt:'2026-09-24T10:05:00.000Z',
        updatedAt:'2026-09-24T10:05:00.000Z',
        activities:[]
      },
      {
        id:'inv-eninext',
        name:'Eni Next',
        type:'Corporate VC',
        stage:'Research',
        priority:'Media',
        thesis:'Da esplorare per possibili connessioni con energia, infrastrutture, sicurezza, ispezioni e logistica.',
        source:'Ricerca iniziale / corporate venturing',
        website:'https://www.eni.com/',
        contactName:'',
        contactRole:'',
        contactEmail:'',
        contactPhone:'',
        lastContact:'',
        nextDate:'',
        nextAction:'Definire use case industriali compatibili con la tesi del corporate venture.',
        notes:'',
        createdAt:'2026-09-24T10:10:00.000Z',
        updatedAt:'2026-09-24T10:10:00.000Z',
        activities:[]
      },
      {
        id:'inv-polihub',
        name:'PoliHub / Poli360',
        type:'Incubator / Accelerator',
        stage:'Qualified',
        priority:'Media',
        thesis:'Può essere utile per validazione, networking, introduzioni a investitori e strutturazione del percorso.',
        source:'Ricerca iniziale',
        website:'https://polihub.it/',
        contactName:'',
        contactRole:'',
        contactEmail:'',
        contactPhone:'',
        lastContact:'',
        nextDate:'',
        nextAction:'Verificare modalità di accesso e interlocutore più adatto.',
        notes:'',
        createdAt:'2026-09-24T10:15:00.000Z',
        updatedAt:'2026-09-24T10:15:00.000Z',
        activities:[]
      },
      {
        id:'inv-galaxia',
        name:'Galaxia',
        type:'Technology Transfer',
        stage:'Qualified',
        priority:'Alta',
        thesis:'Programma particolarmente interessante per la componente aerospace e per il passaggio da tecnologia protetta a proof-of-concept.',
        source:'Ricerca iniziale',
        website:'https://www.cdpventurecapital.it/',
        contactName:'',
        contactRole:'',
        contactEmail:'',
        contactPhone:'',
        lastContact:'',
        nextDate:'',
        nextAction:'Studiare requisiti, finestre e soggetti partner del programma.',
        notes:'',
        createdAt:'2026-09-24T10:20:00.000Z',
        updatedAt:'2026-09-24T10:20:00.000Z',
        activities:[]
      }
    ]
  };

  const i18n = {
    it: {
      nav:{dashboard:'Dashboard',pipeline:'Pipeline investitori'},
      actions:{
        backup:'Backup dati',addInvestor:'+ Aggiungi prospect',edit:'Modifica',delete:'Elimina',cancel:'Annulla',save:'Salva',
        open:'Apri scheda',addActivity:'+ Registra attività'
      },
      dashboard:{
        eyebrow:'INVESTOR RELATIONS / MISSION CONTROL',
        title:'DRONEPAD.<br><span class="neon-text">INVESTOR HUB.</span>',
        intro:'An immersive home hub from which to enter the investor pipeline, review project status and clearly show where the work is going.',
        openPipeline:'Open pipeline',
        scrollIntro:'Discover the hub',
        point1:'Central hub for the project',
        point2:'Detailed investor pipeline',
        point3:'Activities, follow-ups and results',
        visual1:'Infrastructure, mobility, prototype.',
        card1Kicker:'INTRODUCTION',
        card1Title:'An ordered base for investor work.',
        card1Text:'This home hub introduces the meaning of the project and the most important area for now: the investor pipeline, with prospects, contacts and next steps.',
        card2Kicker:'OPERATIONS',
        card2Title:'Less confusion, more control.',
        card2Text:'Each investor has a dedicated record, a stage, an activity history and a next action, so you can immediately show how far the work has gone.',
        card3Kicker:'VISION',
        card3Title:'Immersive design, practical use.',
        card3Text:'Visual effects, imagery and animated copy remain present, but they support a clear and functional platform.',
        img1Kicker:'CONCEPT',
        img1Title:'A vision to turn into opportunity.',
        img2Kicker:'POSITIONING',
        img2Title:'Presenting Dronepad in a credible and memorable way.',
        funnelKicker:'PIPELINE',funnelTitle:'Stage distribution',
        nextKicker:'NEXT ACTIONS',nextTitle:'Upcoming follow-ups',manage:'Manage ↗',
        activityKicker:'RECENT ACTIVITY',activityTitle:'What has been done'
      },
      pipeline:{
        eyebrow:'INVESTOR CRM',
        title:'INVESTOR<br><span class="neon-text">PIPELINE.</span>',
        intro:'Every prospect has a stage, priority, history and next action. Click a name to open the complete record.',
        listKicker:'PROSPECTS',listTitle:'Investor list'
      },
      table:{name:'Prospect',type:'Type',stage:'Stage',priority:'Priority',last:'Last contact',next:'Next action',actions:'Actions'},
      form:{
        name:'Name',type:'Type',stage:'Stage',priority:'Priority',contactName:'Contact person',contactRole:'Role',phone:'Phone',
        website:'Website / Link',lastContact:'Last contact',nextDate:'Next follow-up',thesis:'Why it matters / thesis',
        source:'Source',nextAction:'Next action',notes:'Internal notes'
      },
      detail:{
        back:'← Back to pipeline',overviewKicker:'RECORD',overviewTitle:'Key information',
        nextKicker:'FOLLOW-UP',nextTitle:'Next action',thesisKicker:'THESIS',thesisTitle:'Why it matters',
        activityKicker:'HISTORY',activityTitle:'Activities and contacts',notesKicker:'NOTES',notesTitle:'Internal notes'
      },
      activity:{date:'Date',type:'Type',title:'Title',details:'Details'},
      stages:{Research:'Research',Qualified:'Qualified',Contacted:'Contacted',Meeting:'Meeting','NDA / DD':'NDA / DD','Term Sheet':'Term Sheet'},
      priority:{Alta:'High',Media:'Medium',Bassa:'Low'},
      metric:{total:'Total prospects',advanced:'Beyond research',contacted:'Contacted / meetings',followups:'Open follow-ups'},
      empty:{
        followups:'No follow-up date set.',
        activities:'No activity recorded.',
        pipeline:'No prospects match the filters.',
        notFound:'Investor not found.'
      }
    }
  };

  function clone(v){ return JSON.parse(JSON.stringify(v)); }

  function load(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(!raw){
        const fresh=clone(seed);
        localStorage.setItem(STORAGE_KEY,JSON.stringify(fresh));
        return fresh;
      }
      const parsed=JSON.parse(raw);
      if(!Array.isArray(parsed.investors)) throw new Error('Invalid data');
      return parsed;
    }catch(e){
      const fresh=clone(seed);
      localStorage.setItem(STORAGE_KEY,JSON.stringify(fresh));
      return fresh;
    }
  }

  function save(data){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
  }

  function uid(prefix='id'){
    if(window.crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getLang(){ return localStorage.getItem(LANG_KEY) || 'it'; }
  function setLang(v){ localStorage.setItem(LANG_KEY,v); }

  window.DronepadData = {
    STORAGE_KEY, LANG_KEY, STAGES, TYPES, PRIORITIES, ACTIVITY_TYPES,
    i18n, load, save, uid, getLang, setLang
  };
})();