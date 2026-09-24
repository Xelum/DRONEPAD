# Dronepad Investor Hub — Supabase Connected

Questa versione usa **Supabase come database principale**.

## Configurazione inclusa
- Project URL: già configurato in `supabase-config.js`
- Publishable key: già configurata in `supabase-config.js`
- Secret key: NON utilizzata e NON necessaria nel frontend

## Primo avvio
1. Apri `index.html` con una connessione Internet attiva.
2. Comparirà la schermata privata di accesso.
3. Inserisci email e password dell'utente creato in Supabase.
4. Al primo accesso, se le tabelle Supabase sono vuote, il sito importa automaticamente gli investitori iniziali nel database.
5. Da quel momento Supabase diventa la fonte principale dei dati.

## Cosa viene salvato online
### investors
- nome
- tipo
- stadio
- priorità
- referente e ruolo
- email e telefono
- sito
- tesi
- fonte
- ultimo contatto
- prossimo follow-up
- prossima azione
- note

### investor_activities
- investitore collegato
- data
- tipo di attività
- titolo
- dettagli
- prossima azione
- prossimo follow-up

## Sincronizzazione
Aggiunta, modifica, eliminazione e cambio stadio scrivono direttamente su Supabase.
La copia `localStorage` rimane solo come cache/backup locale: non è più la fonte principale.

## Login
La sessione Supabase viene mantenuta dal browser.
Puoi effettuare il logout dal pulsante con l'iniziale dell'account nella barra superiore.

## Sicurezza
Il frontend contiene solo la **Publishable key**, che è prevista per l'uso client.
Non inserire mai Secret key, service_role key o password database nei file del sito.

## Database
La cartella `supabase/schema.sql` contiene lo schema utilizzato per creare le tabelle e le RLS policies.

## Nota sul primo import
Se il database `investors` è vuoto, il sito prova a migrare i dati presenti nel browser.
Se non trova dati precedenti, importa il set iniziale incluso nel progetto.


## Build F4
Questa build usa file rinominati (`dronepad-final.css` e `dronepad-final.js`) per evitare che Chrome riutilizzi versioni precedenti dalla cache.
Il pulsante Aggiungi Prospect è gestito sia con event delegation in capture phase sia con fallback inline.
