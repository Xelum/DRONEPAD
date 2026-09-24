const STORAGE_KEYS = {
  lang: 'dronepadHQ_lang',
  investors: 'dronepadHQ_investors_final',
  tasks: 'dronepadHQ_tasks_final',
  prototype: 'dronepadHQ_prototype_final'
};

const STAGES = ['Research','Qualified','Contacted','Meeting','NDA / DD','Term Sheet'];
const TASK_STATUSES = ['Now','Next','Waiting','Done'];
const WORKSTREAMS = ['Prototype','Fundraising','IP / Legal','Market','Regulatory','Data Room'];

const i18n = {
  it: {
    title: 'Dronepad HQ — Mission Control',
    brandSub: 'Mission Control',
    nav: {hero:'Inizio', overview:'Dashboard', platform:'Registro', prototype:'Prototipo', investors:'Investitori', ecosystem:'Archivio', tasks:'Azioni'},
    top: {live:'PROGETTO LIVE', export:'Backup dati', progress:'Journey', scroll:'Scorri per esplorare'},
    hero: {
      eyebrow: 'DALL\'IP PROTETTA ALL\'INFRASTRUTTURA OPERATIVA',
      title: 'COSTRUIRE IL PRIMO<br><span class="neon-word">DRONEPAD REALE.</span>',
      body: 'Un centro operativo immersivo per trasformare brevetti, know-how e visione in prototipo, sito pilota, capitale e industrializzazione.',
      cta1: 'Apri pipeline investitori',
      cta2: 'Prontezza prototipo'
    },
    overview: {
      eyebrow: 'QUADRO DI PROGETTO',
      title: 'DRONEPAD,<br><span class="neon-word">IN UNA SOLA VISTA.</span>',
      body: 'La base operativa del progetto: cosa esiste già, cosa manca e cosa dobbiamo dimostrare per trasformare la teoria in una realizzazione concreta.',
      coreKicker: 'CONCETTO',
      coreTitle: 'Infrastruttura modulare di atterraggio per velivoli a decollo e atterraggio verticale',
      coreBody: 'Dronepad è concepito come infrastruttura integrata e modulare per operazioni di decollo/atterraggio verticale, inserita nell\'ecosistema Advanced Air Mobility.',
      caption: 'Concept visuale generato per Dronepad HQ'
    },
    platform: {
      eyebrow: 'ARCHITETTURA DELLA PIATTAFORMA',
      title: '<span class="neon-word">INFRASTRUTTURA DIGITALE</span><br>DEL PROGETTO.',
      body: 'Dronepad HQ riunisce in un unico workspace privato dati, documenti, investitori, attività, stato del prototipo e decisioni operative.',
      todoKicker: 'STACK OPERATIVO',
      todoTitle: 'Componenti del sistema',
      secureKicker: 'SECURITY BY DESIGN',
      secureTitle: 'Niente file sensibili in pubblico.',
      secureBody: 'Business plan, documenti legali, cap table, preventivi e contatti strategici devono vivere in un ambiente autenticato con storage privato.',
      stackTitle: 'Il sistema operativo digitale di Dronepad.',
      stackBody: 'Repository privato, autenticazione, database e storage riservato lavorano insieme per mantenere il progetto ordinato, accessibile e controllato.'
    },
    prototype: {
      eyebrow: 'PROTOTYPE READINESS',
      title: 'TRASFORMARE IL CONCEPT<br><span class="neon-word">IN UN BUILD PLAN.</span>',
      body: 'Qui costruiamo il vero fabbisogno finanziario del primo prototipo, legando ogni euro a un deliverable concreto.',
      progressLabel: 'Prontezza prototipo',
      fundsKicker: 'USE OF FUNDS',
      fundsTitle: 'Il capitale deve seguire le evidenze',
      toQuantify: 'DA QUANTIFICARE',
      visualNote: 'Esploso concettuale del sistema Dronepad: struttura, piattaforma, impianti, sensori e componenti vengono gestiti nel workstream tecnico del prototipo.'
    },
    investors: {
      eyebrow: 'CRM CAPITALI & NETWORK',
      title: 'PIPELINE<br><span class="neon-word">INVESTITORI.</span>',
      body: 'Ogni nome deve avere una ragione, una fonte e una prossima azione. Nessuna lista casuale.',
      add: '+ Aggiungi prospect',
      searchPlaceholder: 'Cerca investitore, categoria o tesi…',
      typeAll: 'Tutti i tipi',
      stageAll: 'Tutti gli stadi',
      tableProspect: 'Prospect', tableType:'Tipo', tableFit:'Fit / tesi', tableVerification:'Verifica', tableStage:'Stadio', tableNext:'Prossima azione',
      pipelineKicker:'PIPELINE', pipelineTitle:'Distribuzione per stadio'
    },
    ecosystem: {
      eyebrow: 'PARTNER, MERCATO, REGOLATORIO, DATA ROOM',
      title: 'CAPITALE È SOLO<br><span class="neon-word">UNA PARTE.</span>',
      body: 'Per arrivare al prototipo servono partner industriali, conoscenza del mercato, workstream regolatorio e una data room sicura e ordinata.',
      partnersKicker:'STRATEGIC PARTNERS', partnersTitle:'Soggetti da coinvolgere',
      marketKicker:'MARKET INTEL', marketTitle:'Lettura dell\'ecosistema',
      regKicker:'REGULATORY', regTitle:'Track normativo',
      dataKicker:'DATA ROOM', dataTitle:'Unica fonte di verità', upload:'Carica file', storageLocal:'Archivio documentale privato del workspace.'
    },
    tasks: {
      eyebrow:'EXECUTION BOARD', title:'LE PROSSIME<br><span class="neon-word">AZIONI.</span>', body:'Il progetto avanza quando ogni open point ha un owner, una scadenza e un output.', add:'+ Aggiungi task',
      criticalKicker:'CRITICAL PATH', criticalTitle:'Nodi operativi', roadmapKicker:'ROADMAP', roadmapTitle:'Sei gate verso il mercato',
      finalTitle:'Dal database al primo Dronepad reale.', finalBody:'La piattaforma diventa il luogo unico in cui raccogliere evidenze, contatti, decisioni, documenti e progressi.'
    },
    modalInvestor: {title:'Aggiungi prospect', name:'Nome', type:'Tipo', fit:'Perché è rilevante', stage:'Stadio', next:'Prossima azione'},
    modalTask: {title:'Aggiungi task', task:'Task', stream:'Workstream', status:'Stato'},
    modal: {cancel:'Annulla', save:'Salva'},
    auth: {title:'Accedi a Dronepad HQ', body:'Accesso riservato al workspace Dronepad HQ e ai suoi contenuti operativi.', signin:'Accedi', signout:'Esci'},
    misc: {
      verified:'Verificato', preliminary:'Preliminare', toVerify:'Da verificare',
      loaded:'Metadati caricati', needsRefresh:'Da aggiornare', toCreate:'Da creare',
      open:'Aperto', later:'Fase successiva',
      sourceManual:'Inserimento manuale',
      exportFile:'dronepad-hq-export-it.json',
      stageLabels: {'Research':'Ricerca','Qualified':'Qualificato','Contacted':'Contattato','Meeting':'Meeting','NDA / DD':'NDA / DD','Term Sheet':'Term Sheet'},
      taskLabels: {'Now':'Ora','Next':'Prossimo','Waiting':'In attesa','Done':'Fatto'}
    }
  },
  en: {
    title: 'Dronepad HQ — Mission Control',
    brandSub: 'Mission Control',
    nav: {hero:'Start', overview:'Dashboard', platform:'Activity Log', prototype:'Prototype', investors:'Investors', ecosystem:'Archive', tasks:'Actions'},
    top: {live:'PROJECT LIVE', export:'Data backup', progress:'Journey', scroll:'Scroll to explore'},
    hero: {
      eyebrow: 'FROM PROTECTED IP TO OPERATING INFRASTRUCTURE',
      title: 'BUILD THE FIRST<br><span class="neon-word">REAL DRONEPAD.</span>',
      body: 'An immersive operating hub to transform patents, know-how and vision into prototype, pilot site, capital and industrialisation.',
      cta1: 'Open investor pipeline',
      cta2: 'Prototype readiness'
    },
    overview: {
      eyebrow: 'PROJECT FRAME',
      title: 'DRONEPAD,<br><span class="neon-word">IN ONE VIEW.</span>',
      body: 'The operational baseline of the project: what already exists, what is missing and what we must prove to turn theory into a tangible outcome.',
      coreKicker: 'CONCEPT',
      coreTitle: 'Modular landing infrastructure for vertical take-off and landing aircraft',
      coreBody: 'Dronepad is positioned as an integrated modular infrastructure for vertical take-off/landing operations inside the Advanced Air Mobility ecosystem.',
      caption: 'Concept visual generated for Dronepad HQ'
    },
    platform: {
      eyebrow: 'PLATFORM ARCHITECTURE',
      title: '<span class="neon-word">DIGITAL INFRASTRUCTURE</span><br>FOR THE PROJECT.',
      body: 'Dronepad HQ brings data, documents, investors, activities, prototype status and operational decisions into one private workspace.',
      todoKicker: 'OPERATING STACK',
      todoTitle: 'System components',
      secureKicker: 'SECURITY BY DESIGN',
      secureTitle: 'No sensitive files in public.',
      secureBody: 'Business plans, legal files, cap tables, quotations and strategic contacts must live in an authenticated environment with private storage.',
      stackTitle: 'The digital operating system for Dronepad.',
      stackBody: 'Private repository, authentication, database and protected storage work together to keep the project organised, accessible and controlled.'
    },
    prototype: {
      eyebrow: 'PROTOTYPE READINESS',
      title: 'TURN THE CONCEPT<br><span class="neon-word">INTO A BUILD PLAN.</span>',
      body: 'Here we build the real funding need for the first prototype, linking every euro to a concrete deliverable.',
      progressLabel: 'Prototype readiness',
      fundsKicker: 'USE OF FUNDS',
      fundsTitle: 'Capital should follow evidence',
      toQuantify: 'TO BE QUANTIFIED',
      visualNote: 'Concept exploded view of Dronepad: structure, platform, systems, sensors and components are managed inside the prototype technical workstream.'
    },
    investors: {
      eyebrow: 'CAPITAL & NETWORK CRM',
      title: 'INVESTOR<br><span class="neon-word">PIPELINE.</span>',
      body: 'Every name must have a reason, a source and a next action. No random list.',
      add: '+ Add prospect',
      searchPlaceholder: 'Search investor, category or thesis…',
      typeAll: 'All types',
      stageAll: 'All stages',
      tableProspect: 'Prospect', tableType:'Type', tableFit:'Fit / thesis', tableVerification:'Verification', tableStage:'Stage', tableNext:'Next action',
      pipelineKicker:'PIPELINE', pipelineTitle:'Stage distribution'
    },
    ecosystem: {
      eyebrow: 'PARTNERS, MARKET, REGULATION, DATA ROOM',
      title: 'CAPITAL IS ONLY<br><span class="neon-word">ONE PIECE.</span>',
      body: 'To reach the prototype we need industrial partners, ecosystem intelligence, a regulatory workstream and a secure, well-structured data room.',
      partnersKicker:'STRATEGIC PARTNERS', partnersTitle:'Players to engage',
      marketKicker:'MARKET INTEL', marketTitle:'Reading the ecosystem',
      regKicker:'REGULATORY', regTitle:'Regulatory track',
      dataKicker:'DATA ROOM', dataTitle:'Single source of truth', upload:'Upload file', storageLocal:'Private document archive for the workspace.'
    },
    tasks: {
      eyebrow:'EXECUTION BOARD', title:'THE NEXT<br><span class="neon-word">ACTIONS.</span>', body:'The project moves forward when every open point has an owner, a deadline and an output.', add:'+ Add task',
      criticalKicker:'CRITICAL PATH', criticalTitle:'Operational nodes', roadmapKicker:'ROADMAP', roadmapTitle:'Six gates to market',
      finalTitle:'From the database to the first real Dronepad.', finalBody:'The platform becomes the single place for evidence, contacts, decisions, documents and progress.'
    },
    modalInvestor: {title:'Add prospect', name:'Name', type:'Type', fit:'Why it matters', stage:'Stage', next:'Next action'},
    modalTask: {title:'Add task', task:'Task', stream:'Workstream', status:'Status'},
    modal: {cancel:'Cancel', save:'Save'},
    auth: {title:'Sign in to Dronepad HQ', body:'Once Supabase is configured, this access protects the CRM, tasks and data room.', signin:'Sign in', signout:'Sign out'},
    misc: {
      verified:'Verified', preliminary:'Preliminary', toVerify:'To verify',
      loaded:'Loaded metadata', needsRefresh:'Needs refresh', toCreate:'To create',
      open:'Open', later:'Later',
      sourceManual:'Manual entry',
      exportFile:'dronepad-hq-export-en.json',
      stageLabels: {'Research':'Research','Qualified':'Qualified','Contacted':'Contacted','Meeting':'Meeting','NDA / DD':'NDA / DD','Term Sheet':'Term Sheet'},
      taskLabels: {'Now':'Now','Next':'Next','Waiting':'Waiting','Done':'Done'}
    }
  }
};

const tData = {
  heroMeta: {
    it: ['IP protetta','Investor CRM','Prototipo','Data room privata','Roadmap'],
    en: ['Protected IP','Investor CRM','Prototype','Private data room','Roadmap']
  },
  signal: {
    it: ['BREVETTI','PROTOTIPO','FUNDING','VERTIPORT','AAM','PILOT SITE','DUE DILIGENCE','GO-TO-MARKET'],
    en: ['PATENTS','PROTOTYPE','FUNDING','VERTIPORT','AAM','PILOT SITE','DUE DILIGENCE','GO-TO-MARKET']
  },
  metrics: {
    it: [
      {label:'COPERTURA IP', value:'IT + US', note:'Asset brevettuali caricati'},
      {label:'FASE PROGETTO', value:'Pre-Prototipo', note:'Focus esecutivo'},
      {label:'CRM PROSPECT', value:'10', note:'profili già mappati'},
      {label:'NORTH STAR', value:'1° Pilot', note:'Dimostratore fisico'}
    ],
    en: [
      {label:'IP COVERAGE', value:'IT + US', note:'Patent assets loaded'},
      {label:'PROJECT STAGE', value:'Pre-Prototype', note:'Execution focus'},
      {label:'CRM PROSPECTS', value:'10', note:'profiles already mapped'},
      {label:'NORTH STAR', value:'1st Pilot', note:'Physical demonstrator'}
    ]
  },
  facts: {
    it: [
      ['Posizionamento','Infrastructure / Vertiport / AAM'],
      ['Stato attuale','IP protetta + piano industriale + deck di mercato'],
      ['Gap principale','Prototipo fisico + validazione + sito pilota'],
      ['Orizzonte commerciale','Industrializzazione e rollout internazionale']
    ],
    en: [
      ['Positioning','Infrastructure / Vertiport / AAM'],
      ['Current state','Protected IP + industrial plan + market deck'],
      ['Primary gap','Physical prototype + validation + pilot site'],
      ['Commercial horizon','Industrialisation and international rollout']
    ]
  },
  overviewCards: {
    it: [
      ['COSA ABBIAMO','Tecnologia protetta','Brevetto italiano, brevetto USA, concept ingegneristico, business plan e presentazione aggiornata.'],
      ['COSA SERVE','Prova nel mondo reale','Technical freeze, BOM, preventivi fornitori, sito pilota, permessi, budget e piano di validazione.'],
      ['COSA SBLOCCA IL CAPITALE','Milestone de-risked','Il capitale deve essere agganciato a milestone misurabili, non a una richiesta generica.']
    ],
    en: [
      ['WHAT WE HAVE','Protected technology','Italian patent, US patent, engineering concept, business plan and updated presentation.'],
      ['WHAT WE NEED','Proof in the real world','Technical freeze, BOM, supplier quotations, pilot site, permissions, budget and validation plan.'],
      ['WHAT CAPITAL UNLOCKS','De-risked milestones','Capital should be tied to measurable milestones rather than a generic headline ask.']
    ]
  },
  architecture: {
    it: [
      ['1','GitHub privato','Repository privato per il codice, versionamento, branching e deploy controllati.'],
      ['2','Frontend','Interfaccia immersiva per dashboard, CRM, task board, data room e reporting.'],
      ['3','Login','Autenticazione per accessi differenziati: admin, team, consulenti, stakeholder.'],
      ['4','Database','Dati strutturati su investitori, partner, attività, note e documenti.'],
      ['5','Storage privato','Archivio sicuro per business plan, brevetti, deck, NDA, preventivi e file riservati.']
    ],
    en: [
      ['1','Private GitHub','Private repository for code, versioning, branching and controlled deployment.'],
      ['2','Frontend','Immersive interface for dashboard, CRM, task board, data room and reporting.'],
      ['3','Login','Authentication for different access levels: admin, team, consultants, stakeholders.'],
      ['4','Database','Structured data on investors, partners, activities, notes and documents.'],
      ['5','Private storage','Secure archive for business plans, patents, decks, NDAs, quotations and confidential files.']
    ]
  },
  platformPriorities: {
    it: [
      ['Repository privato','Codice, versionamento e rilascio controllato del workspace','ACTIVE'],
      ['Frontend Mission Control','Dashboard immersiva, CRM, task, note e Data Room','ACTIVE'],
      ['Database operativo','Struttura dati pronta per investitori, task e checklist','READY'],
      ['Accessi riservati','Autenticazione e ruoli per il workspace privato','READY'],
      ['Archivio documentale','Storage privato locale e cloud per la Data Room','ACTIVE']
    ],
    en: [
      ['Private repository','Code, versioning and controlled workspace release','ACTIVE'],
      ['Mission Control frontend','Immersive dashboard, CRM, tasks, notes and Data Room','ACTIVE'],
      ['Operational database','Data model for investors, tasks and prototype checklist','READY'],
      ['Private access','Authentication and roles for the private workspace','READY'],
      ['Document archive','Private local and cloud storage for the Data Room','ACTIVE']
    ]
  },
  prototypeItems: {
    it: [
      ['Requisiti funzionali','Definire esattamente cosa deve fare il primo prototipo'],
      ['Engineering aggiornato','Rivedere disegni e specifiche in versione 2026'],
      ['Distinta base (BOM)','Mappare componenti, quantità e specifiche'],
      ['Preventivi fornitori','Ottenere prezzi reali aggiornati'],
      ['Sito pilota','Identificare una location realistica per installazione e test'],
      ['Percorso autorizzativo','Mappare permessi, stakeholder e vincoli'],
      ['Piano di test','Definire test, validazione e criteri di successo'],
      ['Cronoprogramma','Sequenza, tempi, dipendenze e milestone'],
      ['Costo totale prototipo','Costruire il budget reale con contingencies'],
      ['Struttura funding','Ripartire il fabbisogno tra equity, grant e partner']
    ],
    en: [
      ['Functional requirements','Define exactly what the first prototype must do'],
      ['Updated engineering','Refresh drawings and specifications for 2026'],
      ['Bill of materials','Map components, quantities and specifications'],
      ['Supplier quotations','Obtain real updated pricing'],
      ['Pilot site','Identify a realistic location for installation and testing'],
      ['Permissions pathway','Map permits, stakeholders and constraints'],
      ['Test plan','Define tests, validation and success criteria'],
      ['Timeline','Sequence, timing, dependencies and milestones'],
      ['Total prototype cost','Build the real budget with contingencies'],
      ['Funding structure','Split the need across equity, grants and partners']
    ]
  },
  fundItems: {
    it: ['Engineering & redesign','Materiali struttura','Piattaforma / deck','Sistemi elettrici & safety','Installazione sito pilota','Test & validazione','Permessi & consulenze','Business development'],
    en: ['Engineering & redesign','Structural materials','Platform / deck','Electrical & safety systems','Pilot site installation','Testing & validation','Permits & advisory','Business development']
  },
  partners: {
    it: [
      ['OEM eVTOL / velivoli VTOL','Per compatibilità geometrica, envelope operativo e casi d\'uso reali.'],
      ['Host del sito pilota','Aeroporti, aree industriali, hub logistici o siti privati utili al primo caso dimostrativo.'],
      ['Construction / steel / modular systems','Per trasformare il concept in un prodotto installabile.'],
      ['Power, charging & energy','Per integrazione impiantistica, alimentazione e possibili use case energetici.'],
      ['Operatori logistici / sicurezza / ispezione','Per agganciare il primo utilizzo concreto a bisogni reali.'],
      ['Consulenti regolatori / legali','Per il rapporto con ENAC, EASA, FAA e la struttura IP/societaria.']
    ],
    en: [
      ['eVTOL / VTOL OEMs','For geometric compatibility, operating envelope and real use cases.'],
      ['Pilot site hosts','Airports, industrial areas, logistics hubs or private sites for the first demonstrator.'],
      ['Construction / steel / modular systems','To turn the concept into an installable product.'],
      ['Power, charging & energy','For power integration, utilities and possible energy-related use cases.'],
      ['Logistics / security / inspection operators','To connect the first deployment to a real operational need.'],
      ['Regulatory / legal advisors','For ENAC, EASA, FAA interactions and IP/corporate structuring.']
    ]
  },
  marketCards: {
    it: [
      ['AAM come ecosistema','Velivoli, infrastrutture, operatori, ricarica, spazio aereo e autorizzazioni devono crescere insieme.', ['Passeggeri','Cargo & last-mile','Air taxi / on-demand','Reti vertiporti']],
      ['Posizionamento tecnico','Sul sito Dronepad viene descritta una struttura installabile su almeno 200 m², con deck di toccata sopraelevato e integrazione urbana.', ['≥ 200 m² area minima','3 m elevazione deck','13 m diametro deck','13 m lunghezza velivolo']],
      ['Tesi di mercato','L\'infrastruttura può valere se consente dimostrabilità, scalabilità e replicabilità, non solo design.', ['Milestone misurabili','1° caso pilota','Credenziali regolatorie','Roadmap internazionale']]
    ],
    en: [
      ['AAM as an ecosystem','Aircraft, infrastructure, operators, charging, airspace and regulation must evolve together.', ['Passenger routes','Cargo & last-mile','Air taxi / on-demand','Vertiport networks']],
      ['Technical positioning','The current Dronepad site describes an installation on at least 200 m², with an elevated touchdown deck and urban integration.', ['≥ 200 m² min area','3 m deck elevation','13 m deck diameter','13 m aircraft length']],
      ['Market thesis','Infrastructure matters if it enables demonstrability, scalability and repeatability, not design alone.', ['Measurable milestones','1st pilot case','Regulatory credentials','International roadmap']]
    ]
  },
  regs: {
    it: [
      ['EASA / quadro europeo','Mappare standard tecnici e operativi pertinenti rispetto al prototipo e all\'uso previsto.','Open'],
      ['ENAC / iter italiano','Identificare il percorso autorizzativo e gli stakeholder per un sito pilota.','Open'],
      ['Permessi urbanistici / edilizi','Strutture, antincendio, accessibilità e vincoli locali.','Open'],
      ['Compatibilità velivolo','Tradurre il target aircraft envelope in requisiti progettuali.','Open'],
      ['Operazioni ed emergenza','Accessi, rescue, antincendio, flussi e responsabilità operative.','Open'],
      ['Pista US / FAA','Workstream separato per futura commercializzazione negli Stati Uniti.','Later']
    ],
    en: [
      ['EASA / European framework','Map the technical and operational standards relevant to the prototype and intended use case.','Open'],
      ['ENAC / Italian pathway','Identify the approval pathway and stakeholders for a pilot site.','Open'],
      ['Urban / building permissions','Structure, fire safety, accessibility and local constraints.','Open'],
      ['Aircraft compatibility','Translate the target aircraft envelope into design requirements.','Open'],
      ['Operations & emergency','Access, rescue, fire response, flows and operational responsibilities.','Open'],
      ['US / FAA track','Separate workstream for future US commercialisation.','Later']
    ]
  },
  docs: {
    it: [
      ['Certificato brevetto italiano','IP / Legal','loaded','Domanda 102020000012313 · inventore Emanuele Angeli · titolare Helidecks S.r.l.'],
      ['Certificato brevetto USA','IP / Legal','loaded','US 12,018,445 B2 · concesso il 25 Jun 2024 · assignee Helidecks S.r.l.'],
      ['Business Plan Deloitte 2023–2028','Business Plan','needsRefresh','Baseline storica da aggiornare con dati e costi 2026.'],
      ['Presentazione principale Dronepad','Pitch / Market','loaded','Presentazione aggiornata con visione, AAM e posizionamento.'],
      ['Investor one-pager','Fundraising','toCreate','Sintesi da usare per il primo outreach.'],
      ['Budget prototipo & BOM','Prototype','toCreate','Use of funds e build plan basati su evidenze.']
    ],
    en: [
      ['Italian patent certificate','IP / Legal','loaded','Application 102020000012313 · inventor Emanuele Angeli · holder Helidecks S.r.l.'],
      ['US patent certificate','IP / Legal','loaded','US 12,018,445 B2 · granted 25 Jun 2024 · assignee Helidecks S.r.l.'],
      ['Deloitte Business Plan 2023–2028','Business Plan','needsRefresh','Historic baseline to be refreshed with 2026 data and costs.'],
      ['Main Dronepad presentation','Pitch / Market','loaded','Updated presentation with vision, AAM and positioning.'],
      ['Investor one-pager','Fundraising','toCreate','Summary to support the first outreach.'],
      ['Prototype budget & BOM','Prototype','toCreate','Evidence-based use of funds and build plan.']
    ]
  },
  roadmap: {
    it: [
      ['IP pronta per due diligence','Famiglia brevettuale, ownership e veicolo di investimento'],
      ['Technical freeze','Requisiti prototipo + engineering aggiornata'],
      ['Economia del prototipo','BOM, preventivi, schedule e contingency'],
      ['Sito pilota','Location + stakeholder + permessi'],
      ['Funding stack','Investitore + grant + partner industriale'],
      ['Build & validate','Prototipo fisico + evidenze + 1° deployment']
    ],
    en: [
      ['Diligence-ready IP','Patent family, ownership and investment vehicle'],
      ['Technical freeze','Prototype requirements + refreshed engineering'],
      ['Prototype economics','BOM, quotations, schedule and contingency'],
      ['Pilot site','Location + stakeholder + permissions'],
      ['Funding stack','Investor + grant + industrial partner'],
      ['Build & validate','Physical prototype + evidence + first deployment']
    ]
  },
  critical: {
    it: [
      ['Chiarire struttura IP','Confermare famiglia brevettuale e allineamento con il veicolo di investimento','NOW'],
      ['Definire scope del prototipo','Stabilire cosa verrà costruito e testato nella fase 1','NOW'],
      ['Ricostruire base costi','Usare quotazioni 2026 invece delle sole assunzioni storiche','NOW'],
      ['Bloccare il percorso pilota','Target location + permessi + host strategico','NEXT'],
      ['Aprire pipeline investitori','Outreach evidence-based dopo la definizione della proposition','NEXT']
    ],
    en: [
      ['Clarify IP structure','Confirm the patent family and alignment with the investment vehicle','NOW'],
      ['Define prototype scope','Decide exactly what will be built and tested in phase 1','NOW'],
      ['Rebuild the cost base','Use 2026 quotations instead of historical assumptions','NOW'],
      ['Lock the pilot pathway','Target location + permissions + strategic host','NEXT'],
      ['Open investor pipeline','Evidence-based outreach after the proposition is ready','NEXT']
    ]
  }
};

const DEFAULT_INVESTORS = [
  {id:1,name:'Algebris Climatech',type:'VC',fit:{it:'Ha già investito €4M in Dronus nel 2026 e mostra interesse reale per tecnologie deep-tech applicate.',en:'Already invested €4M in Dronus in 2026 and shows a real appetite for applied deep-tech.'},verification:'Verified',stage:'Research',next:{it:'Mappare contatto team Climatech e preparare teaser dedicato.',en:'Map the Climatech team contact and prepare a dedicated teaser.'},source:{it:'Press release / ecosistema Dronus',en:'Press release / Dronus ecosystem'}},
  {id:2,name:'CDP Venture Capital',type:'VC',fit:{it:'Interlocutore importante per deep-tech, space e technology transfer.',en:'Key counterpart for deep-tech, space and technology transfer.'},verification:'Verified',stage:'Research',next:{it:'Verificare fondi/strumenti più coerenti e canale di accesso.',en:'Verify the most relevant funds/instruments and access route.'},source:{it:'Sito istituzionale / Galaxia',en:'Institutional site / Galaxia'}},
  {id:3,name:'Eni Next',type:'Corporate VC',fit:{it:'Da valutare se Dronepad può essere connesso a energia, ispezioni, sicurezza o logistica.',en:'Worth exploring if Dronepad can be tied to energy, inspection, security or logistics.'},verification:'Verified',stage:'Research',next:{it:'Definire use case industriali con focus energia/infrastrutture.',en:'Define industrial use cases with an energy/infrastructure focus.'},source:{it:'Portfolio Dronus / corporate venturing',en:'Dronus portfolio / corporate venturing'}},
  {id:4,name:'PoliHub / Poli360',type:'Incubator / Accelerator',fit:{it:'Può agire come moltiplicatore di contatti, investitori e validazione del percorso startup.',en:'Can act as a multiplier of contacts, investors and startup validation.'},verification:'Verified',stage:'Qualified',next:{it:'Preparare candidatura o intro contestualizzata.',en:'Prepare an application or contextual introduction.'},source:{it:'Sito PoliHub / community',en:'PoliHub / community page'}},
  {id:5,name:'Galaxia',type:'Technology Transfer',fit:{it:'Molto interessante se la dimensione aerospaziale/aviation è significativa nel progetto.',en:'Very relevant if the aerospace/aviation dimension is significant in the project.'},verification:'Verified',stage:'Qualified',next:{it:'Verificare finestra di accesso e materiale richiesto.',en:'Verify the access window and required material.'},source:{it:'Polo nazionale trasferimento tecnologico aerospazio',en:'National aerospace tech-transfer hub'}},
  {id:6,name:'SIMEST',type:'Public / Export Finance',fit:{it:'Può diventare rilevante nella fase di espansione internazionale.',en:'Could become relevant in the international expansion phase.'},verification:'Verified',stage:'Research',next:{it:'Capire timing corretto e strumenti applicabili.',en:'Understand the right timing and applicable instruments.'},source:{it:'Partecipazione round Dronus',en:'Participation in the Dronus round'}},
  {id:7,name:'Azimut Venture Capital',type:'VC',fit:{it:'Ha partecipato al round Dronus: utile da mappare per tesi e ticket.',en:'Participated in the Dronus round: useful to map thesis and ticket size.'},verification:'Preliminary',stage:'Research',next:{it:'Individuare partner e tesi di investimento corrente.',en:'Identify the relevant partner and current investment thesis.'},source:{it:'Round Dronus',en:'Dronus round'}},
  {id:8,name:'Growth Capital',type:'Advisor',fit:{it:'Advisor finanziario potenzialmente utile per preparazione raccolta o networking.',en:'Financial advisor potentially useful for fundraising preparation or networking.'},verification:'Preliminary',stage:'Research',next:{it:'Valutare se coinvolgerlo come advisor o intro source.',en:'Assess whether to involve as advisor or intro source.'},source:{it:'Advisor round Dronus',en:'Advisor on Dronus round'}},
  {id:9,name:'Family Office cluster',type:'Family Office',fit:{it:'Canale da costruire con taglio club-deal o co-investimento prototipo.',en:'Channel to build with a club-deal or prototype co-investment angle.'},verification:'To verify',stage:'Research',next:{it:'Creare una short-list di family office con focus industria / mobilità.',en:'Create a short-list of family offices with an industry / mobility focus.'},source:{it:'Da ricercare',en:'To research'}},
  {id:10,name:'Industrial partner candidate',type:'Industrial Partner',fit:{it:'Un partner industriale può ridurre capex, tempi e rischio costruttivo.',en:'An industrial partner can reduce capex, time and execution risk.'},verification:'To verify',stage:'Research',next:{it:'Mappare carpenteria / modular systems / engineering partner.',en:'Map steelwork / modular systems / engineering partners.'},source:{it:'Da costruire',en:'To be built'}}
];

const DEFAULT_TASKS = [
  {id:1,title:{it:'Ricostruire distinta base del prototipo',en:'Rebuild the prototype bill of materials'},stream:'Prototype',status:'Now'},
  {id:2,title:{it:'Definire struttura IP / veicolo investimento',en:'Define the IP / investment vehicle structure'},stream:'IP / Legal',status:'Now'},
  {id:3,title:{it:'Preparare one-pager investitori',en:'Prepare the investor one-pager'},stream:'Fundraising',status:'Next'},
  {id:4,title:{it:'Mappare host potenziali per sito pilota',en:'Map potential hosts for the pilot site'},stream:'Market',status:'Next'},
  {id:5,title:{it:'Aprire workstream regolatorio ENAC / EASA',en:'Open the ENAC / EASA regulatory workstream'},stream:'Regulatory',status:'Waiting'},
  {id:6,title:{it:'Ordinare data room documentale',en:'Organise the documentary data room'},stream:'Data Room',status:'Done'}
];

let currentLang = localStorage.getItem(STORAGE_KEYS.lang) || 'it';
let investors = JSON.parse(localStorage.getItem(STORAGE_KEYS.investors) || 'null') || DEFAULT_INVESTORS;
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks) || 'null') || DEFAULT_TASKS;
let protoState = JSON.parse(localStorage.getItem(STORAGE_KEYS.prototype) || 'null') || new Array(tData.prototypeItems.it.length).fill(false);

const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
const textByLang = (val) => (val && typeof val === 'object' && !Array.isArray(val)) ? (val[currentLang] ?? val.it ?? val.en ?? '') : val;
const tr = (path) => path.split('.').reduce((o,k)=>o?.[k], i18n[currentLang]) ?? path;

function applyStaticTranslations(){
  document.documentElement.lang = currentLang;
  document.title = tr('title');
  $('#brandSub').textContent = tr('brandSub');
  $$('[data-i18n]').forEach(el => el.textContent = tr(el.dataset.i18n));
  $$('[data-i18n-html]').forEach(el => el.innerHTML = tr(el.dataset.i18nHtml));
  $('#investorSearch').placeholder = tr('investors.searchPlaceholder');
}

function renderHeroMeta(){
  $('#heroMeta').innerHTML = tData.heroMeta[currentLang].map(x=>`<span>${x}</span>`).join('');
}

function renderSignal(){
  const items = [...tData.signal[currentLang], ...tData.signal[currentLang], ...tData.signal[currentLang]];
  $('#signalTrack').innerHTML = items.map(x=>`<strong>${x}</strong><b>•</b>`).join('');
}

function renderMetrics(){
  $('#metricGrid').innerHTML = tData.metrics[currentLang].map((x,i)=>`<article class="metric reveal delay-${i>0?1:0}"><span>${x.label}</span><strong ${i===2?'id="metricProspects"':''}>${i===2?investors.length:x.value}</strong><small ${i===2?'id="metricVerified"':''}>${i===2?metricVerifiedText():x.note}</small></article>`).join('');
}
function metricVerifiedText(){
  const verified = investors.filter(x=>x.verification==='Verified').length;
  return currentLang === 'it' ? `${verified} profili verificati` : `${verified} verified profiles`;
}

function renderFacts(){
  $('#factList').innerHTML = tData.facts[currentLang].map(x=>`<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join('');
}

function renderOverviewCards(){
  $('#overviewCards').innerHTML = tData.overviewCards[currentLang].map(x=>`<article class="panel"><span class="kicker">${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p></article>`).join('');
}

function renderArchitecture(){
  const a=$('#architectureGrid'), p=$('#platformPriorities');
  if(a) a.innerHTML = tData.architecture[currentLang].map(x=>`<article class="arch-step reveal"><div class="arch-node">${x[0]}</div><h4>${x[1]}</h4><p>${x[2]}</p></article>`).join('');
  if(p) p.innerHTML = tData.platformPriorities[currentLang].map((x,i)=>`<div class="path-row"><div class="path-index">0${i+1}</div><div><b>${x[0]}</b><small>${x[1]}</small></div><span class="tag ${x[2]==='NOW'?'accent':'neutral'}">${x[2]}</span></div>`).join('');
}

let cloudMode = false;
let currentUser = null;
let uploadedDocuments = [];

function investorToDb(x){
  const row = {
    name:x.name,
    type:x.type,
    fit_it:textByLangFor(x.fit,'it'),
    fit_en:textByLangFor(x.fit,'en'),
    verification:x.verification,
    stage:x.stage,
    next_it:textByLangFor(x.next,'it'),
    next_en:textByLangFor(x.next,'en'),
    source_it:textByLangFor(x.source,'it'),
    source_en:textByLangFor(x.source,'en'),
    priority:x.priority||'Media',
    contact_name:x.contactName||'',
    contact_info:x.contactInfo||'',
    website:x.website||'',
    last_contact:x.lastContact||null,
    next_date:x.nextDate||null,
    notes_it:textByLangFor(x.notes,'it'),
    notes_en:textByLangFor(x.notes,'en')
  };
  if(typeof x.id === 'string' && x.id.includes('-')) row.id=x.id;
  return row;
}
function investorFromDb(r){
  return {
    id:r.id,name:r.name,type:r.type,verification:r.verification,stage:r.stage,
    fit:{it:r.fit_it||'',en:r.fit_en||r.fit_it||''},
    next:{it:r.next_it||'',en:r.next_en||r.next_it||''},
    source:{it:r.source_it||'',en:r.source_en||r.source_it||''},
    priority:r.priority||'Media',
    contactName:r.contact_name||'',
    contactInfo:r.contact_info||'',
    website:r.website||'',
    lastContact:r.last_contact||'',
    nextDate:r.next_date||'',
    notes:{it:r.notes_it||'',en:r.notes_en||r.notes_it||''}
  };
}
function taskToDb(x){
  const row={
    title_it:textByLangFor(x.title,'it'), title_en:textByLangFor(x.title,'en'),
    stream:x.stream,status:x.status,
    due_date:x.dueDate||null,
    owner:x.owner||'',
    notes_it:textByLangFor(x.notes,'it'),
    notes_en:textByLangFor(x.notes,'en')
  };
  if(typeof x.id === 'string' && x.id.includes('-')) row.id=x.id;
  return row;
}
function taskFromDb(r){return {
  id:r.id,title:{it:r.title_it||'',en:r.title_en||r.title_it||''},stream:r.stream,status:r.status,
  dueDate:r.due_date||'',owner:r.owner||'',notes:{it:r.notes_it||'',en:r.notes_en||r.notes_it||''}
};}
function textByLangFor(v,lang){return (v && typeof v==='object' && !Array.isArray(v)) ? (v[lang] ?? v.it ?? v.en ?? '') : (v ?? '');}

function renderPrototype(){
  $('#prototypeChecklist').innerHTML = tData.prototypeItems[currentLang].map((x,i)=>`<label class="check-item"><input type="checkbox" data-proto="${i}" ${protoState[i]?'checked':''}><span><b>${x[0]}</b><span>${x[1]}</span></span></label>`).join('');
  $$('[data-proto]').forEach(c=>c.onchange=async()=>{
    const idx=+c.dataset.proto;
    protoState[idx]=c.checked;
    localStorage.setItem(STORAGE_KEYS.prototype, JSON.stringify(protoState));
    updatePrototypePct();
    if(cloudMode){
      try{await window.DronepadCloud.upsertPrototypeItem(idx,c.checked);}catch(err){console.error(err);showToast(cloudErrorText(err));}
    }
  });
  $('#fundGrid').innerHTML = tData.fundItems[currentLang].map(x=>`<div class="fund-item"><b>${x}</b><span>${currentLang==='it'?'€ — da quantificare':'€ — to quantify'}</span></div>`).join('');
  updatePrototypePct();
}
function updatePrototypePct(){
  const pct = Math.round((protoState.filter(Boolean).length / protoState.length) * 100);
  $('#prototypePct').textContent = `${pct}%`;
  $('#prototypeBar').style.width = `${pct}%`;
}

function badgeLabel(v){
  const map = {Verified: tr('misc.verified'), Preliminary: tr('misc.preliminary'), 'To verify': tr('misc.toVerify')};
  return map[v] || v;
}
function badgeClass(v){return v==='Verified' ? 'good' : v==='Preliminary' ? 'accent' : 'warn';}

function populateFilters(){
  const type = $('#typeFilter');
  const status = $('#statusFilter');
  const typeValue=type.value||'all', statusValue=status.value||'all';
  type.innerHTML = `<option value="all">${tr('investors.typeAll')}</option>` + [...new Set(investors.map(x=>x.type))].sort().map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join('');
  status.innerHTML = `<option value="all">${tr('investors.stageAll')}</option>` + STAGES.map(x=>`<option value="${x}">${tr('misc.stageLabels.'+x)}</option>`).join('');
  if([...type.options].some(o=>o.value===typeValue)) type.value=typeValue;
  if([...status.options].some(o=>o.value===statusValue)) status.value=statusValue;
}

function filteredInvestors(){
  const q = ($('#investorSearch').value || '').toLowerCase();
  const type = $('#typeFilter').value || 'all';
  const stage = $('#statusFilter').value || 'all';
  return investors.filter(x=>{
    const fitTxt = textByLang(x.fit).toLowerCase();
    const sourceTxt = textByLang(x.source).toLowerCase();
    const matchesQ = (`${x.name} ${x.type} ${fitTxt} ${sourceTxt}`).toLowerCase().includes(q);
    return matchesQ && (type==='all'||x.type===type) && (stage==='all'||x.stage===stage);
  });
}

function stageOptions(item){return STAGES.map(v=>`<option value="${v}" ${v===item.stage?'selected':''}>${tr('misc.stageLabels.'+v)}</option>`).join('');}

function renderInvestors(){
  const rows=filteredInvestors();
  $('#investorRows').innerHTML = rows.map(x=>`<tr>
      <td><span class="crm-name">${escapeHtml(x.name)}</span><span class="crm-sub">${escapeHtml(textByLang(x.source))}</span></td>
      <td>${escapeHtml(x.type)}</td>
      <td class="crm-fit">${escapeHtml(textByLang(x.fit))}</td>
      <td><span class="tag ${badgeClass(x.verification)}">${badgeLabel(x.verification)}</span></td>
      <td><select class="select-stage" data-stage="${x.id}">${stageOptions(x)}</select></td>
      <td class="crm-fit">${escapeHtml(textByLang(x.next) || '—')}</td>
    </tr>`).join('');

  $('#investorCards').innerHTML = rows.map(x=>`<article class="investor-card">
      <div class="investor-card-head"><div><h4>${escapeHtml(x.name)}</h4><small>${escapeHtml(x.type)} · ${escapeHtml(textByLang(x.source))}</small></div><span class="tag ${badgeClass(x.verification)}">${badgeLabel(x.verification)}</span></div>
      <p>${escapeHtml(textByLang(x.fit))}</p>
      <div class="investor-card-actions"><select class="select-stage" data-stage="${x.id}">${stageOptions(x)}</select><small>${escapeHtml(textByLang(x.next)||'—')}</small></div>
    </article>`).join('');

  $$('[data-stage]').forEach(sel=>sel.onchange=async()=>{
    const item = investors.find(v => String(v.id) === sel.dataset.stage);
    if(!item) return;
    item.stage = sel.value;
    saveInvestors(false);
    if(cloudMode){
      try{
        const saved=await window.DronepadCloud.upsertRow('investors',investorToDb(item));
        Object.assign(item,investorFromDb(saved));
        saveInvestors(false);
      }catch(err){console.error(err);showToast(cloudErrorText(err));}
    }
  });

  const mp = $('#metricProspects'); if(mp) mp.textContent = investors.length;
  const mv = $('#metricVerified'); if(mv) mv.textContent = metricVerifiedText();
  renderPipeline();
}

function renderPipeline(){
  $('#pipeline').innerHTML = STAGES.map(s=>`<div class="pipeline-col"><span>${tr('misc.stageLabels.'+s)}</span><b>${investors.filter(x=>x.stage===s).length}</b></div>`).join('');
}

function saveInvestors(rerender=true){
  localStorage.setItem(STORAGE_KEYS.investors, JSON.stringify(investors));
  if(rerender) populateFilters();
  renderInvestors();
}

function renderPartners(){const el=$('#partnerGrid');if(el)el.innerHTML = tData.partners[currentLang].map((x,i)=>`<article class="partner-card"><span class="kicker">0${i+1}</span><b>${x[0]}</b><p>${x[1]}</p></article>`).join('');}
function renderMarket(){const el=$('#marketGrid');if(el)el.innerHTML = tData.marketCards[currentLang].map(x=>`<article class="market-card"><span class="kicker">${x[0]}</span><b>${x[1]}</b><p>${x[2]}</p><ul>${x[3].map(y=>`<li>${y}</li>`).join('')}</ul></article>`).join('');}
function renderRegs(){const el=$('#regList');if(el)el.innerHTML = tData.regs[currentLang].map((x,i)=>`<div class="reg-row"><div class="num">0${i+1}</div><div><b>${x[0]}</b><p>${x[1]}</p></div><span class="tag ${x[2]==='Open'?'warn':'neutral'}">${x[2]==='Open'?tr('misc.open'):tr('misc.later')}</span></div>`).join('');}
function statusLabel(code){if(code==='loaded') return tr('misc.loaded');if(code==='needsRefresh') return tr('misc.needsRefresh');return tr('misc.toCreate');}
function statusClass(code){if(code==='loaded') return 'good';if(code==='needsRefresh') return 'accent';return 'warn';}
function renderDocs(){
  $('#documentGrid').innerHTML = tData.docs[currentLang].map(x=>`<article class="document-card"><span class="kicker">${x[1]}</span><b>${x[0]}</b><span class="tag ${statusClass(x[2])}">${statusLabel(x[2])}</span><p>${x[3]}</p></article>`).join('');
  renderUploadedFiles();
}

function renderUploadedFiles(){
  const root=$('#uploadedFiles');
  if(!uploadedDocuments.length){root.innerHTML='';return;}
  root.innerHTML=uploadedDocuments.map(d=>`<div class="uploaded-file"><div><strong>${escapeHtml(d.name)}</strong><small>${formatBytes(d.size_bytes)} · ${escapeHtml(d.mime_type||'file')}</small></div><button class="btn secondary small" data-open-doc="${d.id}" type="button">${currentLang==='it'?'Apri':'Open'}</button></div>`).join('');
  $$('[data-open-doc]').forEach(btn=>btn.onclick=async()=>{
    const d=uploadedDocuments.find(x=>String(x.id)===btn.dataset.openDoc);
    if(!d||!cloudMode) return;
    try{const url=await window.DronepadCloud.signedDocumentUrl(d.storage_path,180);if(url) window.open(url,'_blank','noopener');}catch(err){showToast(cloudErrorText(err));}
  });
}

function renderCritical(){const el=$('#criticalPath');if(el)el.innerHTML = tData.critical[currentLang].map((x,i)=>`<div class="path-row"><div class="path-index">0${i+1}</div><div><b>${x[0]}</b><small>${x[1]}</small></div><span class="tag ${x[2]==='NOW'?'accent':'neutral'}">${x[2]}</span></div>`).join('');}
function renderRoadmap(){const el=$('#roadmap');if(el)el.innerHTML = tData.roadmap[currentLang].map(x=>`<div class="gate"><div class="gate-dot"></div><div><b>${x[0]}</b><span>${x[1]}</span></div></div>`).join('');}
function renderTasks(){$('#taskBoard').innerHTML = TASK_STATUSES.map(st=>`<div class="task-column"><h3>${tr('misc.taskLabels.'+st)} · ${tasks.filter(x=>x.status===st).length}</h3>${tasks.filter(x=>x.status===st).map(x=>`<div class="task-card"><b>${escapeHtml(textByLang(x.title))}</b><span>${escapeHtml(x.stream)}</span></div>`).join('')}</div>`).join('');}
function saveTasks(){localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));renderTasks();}

function exportData(){
  const payload={exportedAt:new Date().toISOString(),language:currentLang,project:'Dronepad HQ',version:'1.0',cloudMode,investors,tasks,prototypeChecklist:tData.prototypeItems[currentLang].map((x,i)=>({item:x[0],note:x[1],done:protoState[i]})),documents:uploadedDocuments.map(({name,mime_type,size_bytes,category,status})=>({name,mime_type,size_bytes,category,status}))};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=tr('misc.exportFile');a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}

function setLanguage(lang){
  currentLang=lang;localStorage.setItem(STORAGE_KEYS.lang,lang);
  $$('#langSwitch button').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===lang));
  applyStaticTranslations();renderHeroMeta();renderSignal();renderMetrics();renderFacts();renderOverviewCards();renderArchitecture();renderPrototype();populateFilters();renderInvestors();renderPartners();renderMarket();renderRegs();renderDocs();renderCritical();renderRoadmap();renderTasks();refreshSelectLabels();refreshCloudUI();initReveal();initPointerGlow();
}

function refreshSelectLabels(){
  const investorStage=$('#investorForm select[name="stage"]');if(investorStage){const current=investorStage.value;investorStage.innerHTML=STAGES.map(v=>`<option value="${v}">${tr('misc.stageLabels.'+v)}</option>`).join('');investorStage.value=current||STAGES[0];}
  const taskStatus=$('#taskForm select[name="status"]');if(taskStatus){const current=taskStatus.value;taskStatus.innerHTML=TASK_STATUSES.map(v=>`<option value="${v}">${tr('misc.taskLabels.'+v)}</option>`).join('');taskStatus.value=current||TASK_STATUSES[0];}
}

async function addInvestorFromForm(fd){
  const item={
    id:Date.now(),
    name:fd.get('name'),
    type:fd.get('type'),
    fit:{it:fd.get('fit')||'',en:fd.get('fit')||''},
    verification:fd.get('verification')||'To verify',
    stage:fd.get('stage')||'Research',
    next:{it:fd.get('next')||'',en:fd.get('next')||''},
    source:{it:fd.get('source')||tr('misc.sourceManual'),en:fd.get('source')||i18n.en.misc.sourceManual},
    priority:fd.get('priority')||'Media',
    contactName:fd.get('contactName')||'',
    contactInfo:fd.get('contactInfo')||'',
    website:fd.get('website')||'',
    lastContact:fd.get('lastContact')||'',
    nextDate:fd.get('nextDate')||'',
    notes:{it:fd.get('notes')||'',en:fd.get('notes')||''}
  };
  if(cloudMode){const saved=await window.DronepadCloud.upsertRow('investors',investorToDb(item));investors.push(investorFromDb(saved));}else investors.push(item);
  saveInvestors();
}
async function addTaskFromForm(fd){
  const item={
    id:Date.now(),
    title:{it:fd.get('title'),en:fd.get('title')},
    stream:fd.get('stream'),
    status:fd.get('status'),
    dueDate:fd.get('dueDate')||'',
    owner:fd.get('owner')||'',
    notes:{it:fd.get('notes')||'',en:fd.get('notes')||''}
  };
  if(cloudMode){const saved=await window.DronepadCloud.upsertRow('tasks',taskToDb(item));tasks.push(taskFromDb(saved));}else tasks.push(item);
  saveTasks();
}

function bindUI(){
  $$('#langSwitch button').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));
  $('#exportBtn').addEventListener('click',exportData);
  $('#investorSearch').addEventListener('input',renderInvestors);$('#typeFilter').addEventListener('change',renderInvestors);$('#statusFilter').addEventListener('change',renderInvestors);
  $('#menuToggle').addEventListener('click',()=>document.body.classList.toggle('menu-open'));
  $$('#mainNav a, .mobile-dock a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));

  const investorDialog=$('#investorDialog'), investorForm=$('#investorForm');
  $('#addInvestorBtn').addEventListener('click',()=>investorDialog.showModal());
  $('#saveInvestor').addEventListener('click',async e=>{e.preventDefault();const fd=new FormData(investorForm);try{await addInvestorFromForm(fd);investorForm.reset();investorDialog.close();}catch(err){showToast(cloudErrorText(err));}});

  const taskDialog=$('#taskDialog'), taskForm=$('#taskForm');
  $('#addTaskBtn').addEventListener('click',()=>taskDialog.showModal());
  $('#saveTask').addEventListener('click',async e=>{e.preventDefault();const fd=new FormData(taskForm);try{await addTaskFromForm(fd);taskForm.reset();taskDialog.close();}catch(err){showToast(cloudErrorText(err));}});

  $('#accountBtn').addEventListener('click',openAuthDialog);$('#cloudStatusBtn').addEventListener('click',openAuthDialog);$('#closeAuth').addEventListener('click',()=>{if(!(window.DronepadCloud?.configured&&window.DronepadCloud.requireAuth&&!currentUser))$('#authDialog').close();});
  $('#authDialog').addEventListener('cancel',e=>{if(window.DronepadCloud?.configured&&window.DronepadCloud.requireAuth&&!currentUser)e.preventDefault();});
  $('#authForm').addEventListener('submit',async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);$('#authError').textContent='';try{await window.DronepadCloud.signIn(fd.get('email'),fd.get('password'));await enterCloudSession();$('#authDialog').close();}catch(err){$('#authError').textContent=cloudErrorText(err);}});
  $('#signOutBtn').addEventListener('click',async()=>{try{await window.DronepadCloud.signOut();exitCloudSession();$('#authDialog').close();}catch(err){$('#authError').textContent=cloudErrorText(err);}});

  $('#documentUpload').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;if(!cloudMode){showToast(currentLang==='it'?'Archivio privato disponibile su questo dispositivo.':'Private archive available on this device.');e.target.value='';return;}try{const doc=await window.DronepadCloud.uploadDocument(file);uploadedDocuments.push(doc);renderUploadedFiles();showToast(currentLang==='it'?'File caricato nella Data Room.':'File uploaded to the Data Room.');}catch(err){showToast(cloudErrorText(err));}finally{e.target.value='';}});
}

function openAuthDialog(){
  if(!window.DronepadCloud?.configured){showToast(currentLang==='it'?'Workspace privato attivo su questo dispositivo.':'Private workspace active on this device.');return;}
  const d=$('#authDialog');
  $('#authError').textContent='';
  $('#authIntro').textContent=tr('auth.body');
  d.showModal();
}

function refreshCloudUI(){
  const cloud=window.DronepadCloud;
  const statusBtn=$('#cloudStatusBtn'), statusText=$('#cloudStatusText'), mini=$('#cloudMiniStatus'), storage=$('#storageNote'), signOut=$('#signOutBtn'), initial=$('#accountInitial');
  if(statusBtn) statusBtn.classList.toggle('connected',cloudMode);
  if(mini) mini.classList.toggle('connected',cloudMode);
  if(storage) storage.classList.toggle('connected',cloudMode);
  if(statusText) statusText.textContent=cloudMode?'SYNC ATTIVA':'WORKSPACE PRIVATO';
  if(mini?.querySelector('span')) mini.querySelector('span').textContent=cloudMode?'SYNC ATTIVA':'WORKSPACE PRIVATO';
  if(storage?.querySelector('span')) storage.querySelector('span').textContent=cloudMode?(currentLang==='it'?'Archivio privato sincronizzato.':'Private archive synced.'):(currentLang==='it'?'Archivio privato attivo su questo dispositivo.':'Private archive active on this device.');
  if(signOut) signOut.style.display=cloudMode?'inline-flex':'none';
  if(initial) initial.textContent=(currentUser?.email?.trim()?.[0]||'A').toUpperCase();
}

async function seedCloudIfNeeded(){
  const cloud=window.DronepadCloud;
  const existingInvestors=await cloud.listRows('investors');
  if(!existingInvestors.length) await cloud.insertRows('investors',DEFAULT_INVESTORS.map(investorToDb));
  const existingTasks=await cloud.listRows('tasks');
  if(!existingTasks.length) await cloud.insertRows('tasks',DEFAULT_TASKS.map(taskToDb));
  const existingPrototype=await cloud.listRows('prototype_items');
  if(!existingPrototype.length){for(let i=0;i<tData.prototypeItems.it.length;i++) await cloud.upsertPrototypeItem(i,false);}
}

async function loadCloudData(){
  const cloud=window.DronepadCloud;
  const [ir,trw,pr,docs]=await Promise.all([cloud.listRows('investors'),cloud.listRows('tasks'),cloud.listRows('prototype_items'),cloud.listDocuments()]);
  investors=ir.map(investorFromDb);tasks=trw.map(taskFromDb);protoState=new Array(tData.prototypeItems.it.length).fill(false);pr.forEach(r=>{const i=Number(r.item_key);if(Number.isFinite(i)&&i<protoState.length)protoState[i]=Boolean(r.done);});uploadedDocuments=docs||[];
  localStorage.setItem(STORAGE_KEYS.investors,JSON.stringify(investors));localStorage.setItem(STORAGE_KEYS.tasks,JSON.stringify(tasks));localStorage.setItem(STORAGE_KEYS.prototype,JSON.stringify(protoState));
  populateFilters();renderInvestors();renderTasks();renderPrototype();renderUploadedFiles();
}

async function enterCloudSession(){
  if(!window.DronepadCloud?.configured) return;
  const ses=await window.DronepadCloud.getSession();
  currentUser=ses.user;if(!currentUser){cloudMode=false;refreshCloudUI();return;}
  cloudMode=true;document.body.classList.remove('auth-locked');await window.DronepadCloud.ensureProject();await seedCloudIfNeeded();await loadCloudData();refreshCloudUI();
}
function exitCloudSession(){cloudMode=false;currentUser=null;uploadedDocuments=[];if(window.DronepadCloud?.configured&&window.DronepadCloud.requireAuth){document.body.classList.add('auth-locked');setTimeout(openAuthDialog,0);}investors=JSON.parse(localStorage.getItem(STORAGE_KEYS.investors)||'null')||DEFAULT_INVESTORS;tasks=JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks)||'null')||DEFAULT_TASKS;protoState=JSON.parse(localStorage.getItem(STORAGE_KEYS.prototype)||'null')||new Array(tData.prototypeItems.it.length).fill(false);refreshCloudUI();setLanguage(currentLang);}

async function initCloud(){
  const cloud=window.DronepadCloud;
  refreshCloudUI();
  if(!cloud?.configured) return;
  cloud.onAuthStateChange(async(_event,session)=>{if(session?.user){currentUser=session.user;if(!cloudMode)await enterCloudSession();}else if(cloudMode)exitCloudSession();});
  try{const {user}=await cloud.getSession();if(user){currentUser=user;await enterCloudSession();}else if(cloud.requireAuth){document.body.classList.add('auth-locked');openAuthDialog();}}catch(err){console.error(err);showToast(cloudErrorText(err));}
}

function cloudErrorText(err){return err?.message||String(err||'Unknown error');}
function formatBytes(bytes=0){if(!bytes)return'0 B';const u=['B','KB','MB','GB'];const i=Math.min(Math.floor(Math.log(bytes)/Math.log(1024)),u.length-1);return`${(bytes/1024**i).toFixed(i?1:0)} ${u[i]}`;}
function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function showToast(message){let t=$('#appToast');if(!t){t=document.createElement('div');t.id='appToast';t.style.cssText='position:fixed;z-index:90;left:50%;bottom:calc(90px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);max-width:min(520px,calc(100vw - 28px));padding:12px 16px;border:1px solid rgba(131,232,255,.2);border-radius:999px;background:rgba(4,10,15,.94);backdrop-filter:blur(18px);color:white;font-size:12px;box-shadow:0 18px 50px rgba(0,0,0,.4);opacity:0;transition:.25s';document.body.appendChild(t);}t.textContent=message;t.style.opacity='1';clearTimeout(t._tm);t._tm=setTimeout(()=>t.style.opacity='0',2800);}

let revealObserver = null;
function initReveal(){
  const targets = $$('.reveal');

  // Progressive enhancement: content is visible by default.
  // Only elements successfully registered for animation get temporarily hidden.
  if(!('IntersectionObserver' in window)){
    targets.forEach(el=>{
      el.classList.remove('reveal-ready');
      el.classList.add('visible');
    });
    return;
  }

  if(!revealObserver){
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold:.04, rootMargin:'0px 0px -4% 0px'});
  }

  targets.forEach(el=>{
    if(el.dataset.revealBound === '1') return;
    el.dataset.revealBound = '1';
    el.classList.add('reveal-ready');

    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight * 1.02 && r.bottom > -40){
      el.classList.add('visible');
    }else{
      revealObserver.observe(el);
    }
  });
}

function initScrollSystems(){
  const sections = $$('main section[id]');
  const floating = $$('.floating-panel');
  const signalTrack = $('#signalTrack');
  const update = () => {
    const scrollY = window.scrollY;
    const docH = document.body.scrollHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrollY / Math.max(1, docH)));
    $('#progressFill').style.height = `${progress * 100}%`;
    $('#coordA').textContent = `X ${(progress*100).toFixed(3)}`;
    $('#coordB').textContent = `Z ${((1-progress)*100).toFixed(3)}`;

    $$('[data-depth]').forEach(el => {
      const depth = parseFloat(el.dataset.depth || '0');
      const rect = el.getBoundingClientRect();
      const move = (window.innerHeight/2 - (rect.top + rect.height/2)) * depth * 0.2;
      el.style.transform = `translate3d(0, ${move}px, 0)`;
    });
    floating.forEach((el, i)=> {
      const rect = el.getBoundingClientRect();
      const move = (window.innerHeight/2 - (rect.top + rect.height/2)) * (0.03 + i*0.005);
      el.style.setProperty('--floatY', `${move}px`);
    });

    const current = sections.find(sec => {
      const r = sec.getBoundingClientRect();
      return r.top <= window.innerHeight*0.28 && r.bottom >= window.innerHeight*0.28;
    }) || sections[0];
    $$('#mainNav a, .mobile-dock a').forEach(a=>a.classList.toggle('active', a.dataset.nav === current.id));

    if(signalTrack){
      signalTrack.style.transform = `translateX(${-scrollY * 0.2}px)`;
    }

    // Fallback reveal: even if IntersectionObserver is delayed or blocked,
    // anything entering the viewport becomes visible.
    $$('.reveal.reveal-ready:not(.visible)').forEach(el=>{
      const r = el.getBoundingClientRect();
      if(r.top < window.innerHeight * .96 && r.bottom > -40){
        el.classList.add('visible');
        if(revealObserver) revealObserver.unobserve(el);
      }
    });
  };
  update();
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
}

function initPointerGlow(){
  ['.panel','.metric','.patent-card','.partner-card','.document-card','.market-card','.task-card'].forEach(sel => {
    $$(sel).forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    });
  });
}

function ambient(){
  const canvas = $('#space');
  const ctx = canvas.getContext('2d');
  let w=0,h=0,particles=[],lines=[];
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  function resize(){
    w = canvas.width = window.innerWidth * DPR;
    h = canvas.height = window.innerHeight * DPR;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const particleCount = window.innerWidth < 640 ? 34 : window.innerWidth < 980 ? 52 : 80;
    particles = Array.from({length:particleCount},()=>({
      x: Math.random()*w,
      y: Math.random()*h,
      r: (Math.random()*1.8 + .6) * DPR,
      vx: (Math.random()-.5)*.18*DPR,
      vy: (Math.random()-.5)*.18*DPR,
      alpha: Math.random()*.6 + .2
    }));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'rgba(73,184,223,.04)');
    g.addColorStop(1,'rgba(255,138,36,.015)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    for(let i=0;i<particles.length;i++){
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;
      ctx.beginPath();
      ctx.fillStyle = `rgba(135,211,237,${p.alpha})`;
      ctx.shadowBlur = 14*DPR;
      ctx.shadowColor = 'rgba(135,211,237,.24)';
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;

      for(let j=i+1;j<particles.length;j++){
        const q = particles[j];
        const dx = p.x-q.x, dy = p.y-q.y;
        const dist = Math.hypot(dx,dy);
        if(dist < 110*DPR){
          ctx.strokeStyle = `rgba(135,211,237,${(1 - dist/(110*DPR))*0.12})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x,p.y);
          ctx.lineTo(q.x,q.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  resize();
  draw();
  window.addEventListener('resize', resize);
}

bindUI();
setLanguage(currentLang);
initReveal();
initScrollSystems();
initPointerGlow();
ambient();
initCloud();
document.body.dataset.appReady = '1';
