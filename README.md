# Agent Directory (Next.js)

A clean, read-only agent directory built with Next.js. All data is loaded
directly from `data/directory-data.json` — there is no external API and no
server route involved.

- **Home page** (`/`) — a searchable table of agents (20 per page): name,
  super name, and a "Details" button, with pagination.
- **Details page** (`/agents/[id]`) — the full profile for a single agent:
  personal info, agency info, documents, company SIM numbers, phones,
  fined/bonus/loan records, present-sell history by year, and photos.

No login, upload, download, or dashboard — purely for browsing and reading
data.

## Data

Everything comes from `data/directory-data.json`. To update the directory,
replace that file (keep the `{ "agents": [...] }` shape) and redeploy.
`lib/agentApi.js` reads the file and handles search and pagination.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build for production

```bash
npm run build
npm run start
```

Deploy anywhere that runs Node.js (Vercel, Render, Netlify, etc.).

## Project structure

```
app/
  page.js                     Home page (table + search)
  agents/[id]/page.js         Agent details page
  components/                 Shared UI pieces
data/directory-data.json      All agent data
lib/agentApi.js               Reads the JSON; search + pagination helpers
```
