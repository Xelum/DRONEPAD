# Dronepad Investor Hub — Definitivo

Questa build è stata ricostruita per eliminare i problemi della versione precedente.

## Correzioni principali

- Traduzioni IT/EN ricostruite e verificate: non compaiono più chiavi tipo `dashboard.point1`.
- Immagini bloccate dentro contenitori con dimensioni massime precise: non possono più occupare mezza pagina o uscire dal layout.
- Hero responsive desktop/mobile.
- Contenuto visibile anche se JavaScript fallisce; le animazioni sono progressive e non bloccano il testo.
- Scie neon blu soltanto dall'alto verso il basso, con lieve inclinazione.
- Effetti glow e comparsa allo scroll mantenuti ma più discreti.
- Home Hub introduttiva con scritta DRONEPAD.
- Pipeline investitori completa con filtri, modifica, eliminazione e cambio stadio.
- Scheda investitore dedicata con attività, follow-up, note e contatti.
- Backup JSON.
- Dati salvati nel browser con lo stesso storage della versione Investor Hub precedente.

## File

- `index.html` — Home Hub + dashboard
- `pipeline.html` — Pipeline investitori
- `investor.html` — Scheda dettaglio investitore
- `data.js` — Dati e traduzioni
- `app.js` — Logica della piattaforma
- `styles.css` — Layout, responsive ed effetti
- `assets/` — Logo e immagini concept

## Mobile

La home, la pipeline e la scheda investitore sono adattate a smartphone. La tabella desktop diventa una serie di card e le immagini vengono ridimensionate con `object-fit: contain`.
