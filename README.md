# Dronepad HQ — Mission Control

Pacchetto completo della piattaforma operativa Dronepad HQ.

## Avvio immediato
Aprire `index.html` in un browser moderno.

La piattaforma funziona anche senza backend:
- CRM investitori;
- task board;
- checklist prototipo;
- note operative;
- modifica dei testi principali direttamente dall'interfaccia;
- Data Room privata locale tramite IndexedDB;
- export JSON;
- lingua IT / EN;
- animazioni e visual immersivi;
- layout desktop, tablet e mobile.

## Modifica dei contenuti
Premere **Modifica** nella barra superiore. I principali testi della piattaforma diventano editabili.
Premere **Salva** per memorizzarli nel browser. Le modifiche sono separate per lingua italiana e inglese.

## Data Room
Senza backend cloud, i file caricati vengono memorizzati in modo persistente nel browser tramite IndexedDB.
È possibile aprire, scaricare o eliminare i file dal workspace.

## Backend privato opzionale
La cartella `supabase/` e i file `config.js`, `config.example.js` e `cloud.js` consentono di attivare:
- autenticazione;
- database condiviso;
- storage privato cloud;
- sincronizzazione multi-dispositivo.

Il frontend resta pienamente utilizzabile anche prima della connessione cloud.

## Repository
Per il progetto reale è consigliato un repository GitHub privato.

## Mobile
La piattaforma include:
- navigazione mobile inferiore;
- CRM in card;
- immagini responsive;
- safe-area iPhone;
- layout ad una colonna sui display stretti;
- animazioni alleggerite su smartphone.
