# Dronepad HQ — MVP v0.1

Static prototype of the Dronepad project command center.

## What is included
- Immersive responsive dashboard
- Project / IP / prototype workstreams
- Investor CRM with search, filters and editable pipeline stage
- Add-new-investor modal
- Prototype-readiness checklist with local persistence
- Strategic partner map
- Regulatory workstream
- Data Room metadata view
- Task board + add task
- JSON export
- Local persistence via `localStorage`

## Run locally
Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages
This version can be committed directly to a GitHub repository and published through GitHub Pages.

**Important:** the MVP intentionally contains no confidential business-plan files. Do not upload confidential diligence material to a public GitHub Pages repository.

## Recommended v0.2 architecture
- Frontend: Next.js / React
- Auth: Supabase Auth
- Database: PostgreSQL / Supabase
- Private document storage: Supabase Storage or another private DMS
- Hosting: Cloudflare Pages / Vercel
- GitHub repository: private

## Seed data provenance
The initial CRM combines:
- targets included in the management's preliminary AI research;
- profiles independently verified from public official sources where explicitly marked `Verified`.

The CRM is designed so unverified names remain clearly labelled until checked.
