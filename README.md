# DRONEPAD HQ — v0.3

Versione 0.3 della piattaforma operativa Dronepad.

Questa release unisce due modalità:

1. **Demo locale immediatamente utilizzabile** — nessun account o backend necessario.
2. **Modalità privata cloud** — login, database e storage privato tramite Supabase.

La UI è **bilingue IT / EN**, immersiva, animata e progettata per essere navigabile anche da smartphone.

---

## Cosa contiene

### Front-end immersivo
- hero cinematico e scroll-based;
- particelle animate in canvas;
- parallax e reveal on scroll;
- visual 3D PNG trasparenti generati appositamente per Dronepad;
- switch IT / EN;
- dashboard operativa;
- prototype readiness;
- CRM investitori;
- partner / market / regulatory;
- data room;
- task board;
- export JSON.

### Mobile
La v0.3 contiene breakpoint dedicati per desktop, tablet e smartphone:
- layout a colonna su smartphone;
- tipografia fluida con `clamp()`;
- immagini ridimensionate senza overflow;
- CRM convertito in card su mobile;
- menu mobile fisso in basso;
- supporto safe-area iPhone tramite `env(safe-area-inset-bottom)`;
- particelle ridotte sui dispositivi piccoli per migliorare performance;
- form e dialog a larghezza mobile.

### Backend pronto per Supabase
Sono già presenti:
- login email/password;
- sessione persistente;
- database multi-progetto;
- RLS (Row Level Security);
- CRM investitori sincronizzato;
- task sincronizzati;
- prototype checklist sincronizzata;
- bucket privato per documenti;
- URL firmati temporanei per aprire i file della Data Room.

---

# STRUTTURA FILE

```text
dronepad-hq-v03/
├── index.html
├── styles.css
├── app.js
├── cloud.js
├── config.js
├── config.example.js
├── vercel.json
├── .gitignore
├── README.md
├── supabase/
│   └── schema.sql
└── assets/
    ├── dronepad-logo.png
    ├── dronepad-aerial.png
    ├── dronepad-night.jpg
    ├── dronepad-render.png
    ├── vertiport-night.jpg
    └── generated/
        ├── dronepad-platform.png
        ├── dronepad-landing.png
        ├── dronepad-exploded.png
        └── dronepad-orbit.png
```

---

# 1. PROVA SUBITO LA VERSIONE LOCALE

Apri `index.html` nel browser oppure usa un piccolo server locale.

Esempio Python:

```bash
python -m http.server 8080
```

Poi apri:

```text
http://localhost:8080
```

In questa modalità:
- CRM, task e checklist vengono salvati nel `localStorage` del browser;
- l'upload documenti cloud è disabilitato;
- la piattaforma segnala `LOCAL MODE`.

---

# 2. CREA IL REPOSITORY GITHUB PRIVATO

Crea un repository **Private** su GitHub, ad esempio:

```text
dronepad-hq
```

Poi dalla cartella del progetto:

```bash
git init
git add .
git commit -m "Dronepad HQ v0.3"
git branch -M main
git remote add origin https://github.com/TUO-ACCOUNT/dronepad-hq.git
git push -u origin main
```

---

# 3. CREA IL PROGETTO SUPABASE

1. Crea un nuovo progetto Supabase.
2. Apri **SQL Editor**.
3. Incolla ed esegui tutto il file:

```text
supabase/schema.sql
```

Lo script crea:
- `projects`
- `project_members`
- `investors`
- `tasks`
- `prototype_items`
- `documents`
- bucket privato `dronepad-documents`
- policy RLS per proteggere i dati.

---

# 4. CREA IL PRIMO UTENTE

Nel progetto Supabase:

**Authentication → Users → Add user**

Crea l'account che userete per entrare in Dronepad HQ.

Puoi successivamente aggiungere altri utenti e membri del progetto.

---

# 5. COLLEGA IL FRONT-END A SUPABASE

Apri `config.js` e sostituisci:

```js
window.DRONEPAD_CONFIG = {
  supabase: {
    enabled: true,
    url: 'https://TUO-PROGETTO.supabase.co',
    anonKey: 'LA_TUA_ANON_KEY',
    requireAuth: true,
    storageBucket: 'dronepad-documents'
  }
};
```

Trovi `url` e `anon key` in:

**Supabase → Project Settings → API**

## IMPORTANTE
Nel browser usa esclusivamente la **anon key**.

**NON inserire mai la `service_role` key nel sito.**

La sicurezza dei dati viene garantita dalle policy RLS definite in `schema.sql`.

---

# 6. PRIMO ACCESSO

Quando `enabled: true` e `requireAuth: true`:

- Dronepad HQ mostra automaticamente il login;
- senza sessione valida l'area di lavoro rimane bloccata;
- al primo accesso viene creato automaticamente il progetto `Dronepad Italy`;
- vengono caricati i dati iniziali della piattaforma se il database è vuoto.

Da quel momento CRM, task e checklist sono sincronizzati nel cloud.

---

# 7. DATA ROOM PRIVATA

Una volta autenticati è possibile usare **Carica file** nella sezione Data Room.

I documenti vengono salvati nel bucket privato:

```text
dronepad-documents
```

La struttura del percorso è:

```text
PROJECT_ID / USER_ID / file
```

I file non sono pubblici.

Quando si preme **Apri**, la piattaforma genera un URL firmato temporaneo.

---

# 8. DEPLOY ONLINE

La cartella include `vercel.json`, quindi puoi collegare direttamente il repository GitHub privato a Vercel.

Flusso consigliato:

```text
GitHub Private Repository
        ↓
      Vercel
        ↓
  Dronepad HQ online
        ↓
     Supabase
  Auth + DB + Storage
```

Puoi usare anche Cloudflare Pages o Netlify; il progetto è completamente statico lato front-end.

---

# SICUREZZA

- repository GitHub: **Private**;
- bucket Supabase: **Private**;
- file sensibili: mai dentro `assets/`;
- business plan, NDA, cap table e preventivi: caricarli solo nella Data Room;
- anon key Supabase: utilizzabile nel browser perché le policy RLS proteggono i dati;
- service role: mai nel front-end;
- per la produzione, valuta MFA e account individuali per ogni collaboratore.

---

# IMMAGINI GENERATE

Le quattro immagini in `assets/generated/` sono PNG con trasparenza e sono state inserite direttamente nell'interfaccia:

- `dronepad-platform.png` → Hero / finale
- `dronepad-landing.png` → Overview
- `dronepad-exploded.png` → Prototype
- `dronepad-orbit.png` → Platform / Mission Control

Sono visual concept, quindi non sostituiscono engineering, disegni costruttivi o rappresentazioni tecniche ufficiali del brevetto.

---

# PROSSIMI STEP CONSIGLIATI

1. Collegare Supabase reale.
2. Creare utenti del team.
3. Caricare i documenti ufficiali nella Data Room.
4. Aggiungere owner e deadline ai task.
5. Costruire la BOM del prototipo.
6. Trasformare il CRM in vera pipeline di outreach con date, contatti e follow-up.
7. Aggiungere una sezione `Meetings / Notes` e una sezione `Funding / Use of Funds` con importi reali.
