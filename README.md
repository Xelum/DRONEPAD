# Dronepad Investor Hub

Versione focalizzata esclusivamente sulla ricerca e gestione degli investitori.

## Struttura
- `index.html` — dashboard sintetica dell'avanzamento;
- `pipeline.html` — CRM/pipeline investitori;
- `investor.html?id=...` — scheda dettagliata del singolo prospect;
- `data.js` — modello dati, traduzioni IT/EN e salvataggio;
- `app.js` — logica applicativa;
- `styles.css` — grafica responsive ed effetti blue-neon.

## Funzioni
### Dashboard
- totale prospect;
- prospect oltre la sola ricerca;
- contatti/meeting avviati;
- follow-up aperti;
- distribuzione per stadio;
- prossimi follow-up;
- attività recenti.

### Pipeline
- ricerca e filtri;
- aggiunta prospect;
- modifica;
- eliminazione;
- aggiornamento rapido dello stadio;
- priorità;
- ultimo contatto;
- prossima azione;
- apertura della scheda dettagliata.

### Scheda investitore
- contatti;
- sito;
- tesi;
- fonte;
- ultimo contatto;
- follow-up;
- note;
- cronologia attività;
- aggiunta/modifica/eliminazione delle attività.

## Salvataggio dati
I dati vengono salvati automaticamente nel browser tramite `localStorage`.
Il pulsante **Backup dati** genera un file JSON con l'intero database.

## Lingue
Interfaccia italiana di default, con switch IT / EN.

## Mobile
La piattaforma è progettata anche per smartphone:
- pipeline a card;
- modali a colonna;
- menu inferiore;
- layout responsive;
- effetti neon alleggeriti.

## Effetti visuali
Le scie blue-neon scendono dall'alto verso il basso con una lieve inclinazione.
Non sono presenti scie orizzontali.
