# Agent Directory (Next.js)

A clean, read-only frontend for the `https://backend.adminak.com/agents` API,
built with Next.js so the CORS problem from the plain React/Vite version
can't happen.

- **Home page** (`/`) — a searchable table of agents (20 per page): name,
  super name, and a "Details" button, with pagination.
- **Details page** (`/agents/[id]`) — the full profile for a single agent:
  personal info, agency info, documents, company SIM numbers, phones,
  fined/bonus/loan records, present-sell history by year, and photos.

No login, upload, download, or dashboard — purely for browsing and reading
data.

## Why this fixes the CORS error

In the previous (Vite/React) version, the browser called
`backend.adminak.com` directly. If that server doesn't send
`Access-Control-Allow-Origin` headers, browsers block the request — the API
itself is fine, but the browser refuses to hand you the response.

Here, the browser only ever calls **this app's own routes**:
`/api/agents` and `/api/agents/[id]` (see `app/api/agents/route.js` and
`app/api/agents/[id]/route.js`). Those routes run on the Next.js **server**,
and make the request to `backend.adminak.com` server-to-server — CORS is a
browser-only rule, so it never comes into play there. This is the same
reason a `curl` request to that API succeeds even when a browser's `fetch`
would be blocked.

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

Deploy anywhere that runs Node.js (Vercel, Render, your own server, etc.) —
the API routes need a Node runtime, so this can't be exported as static
HTML.

## Project structure

```
app/
  page.js                     Home page (table + search)
  agents/[id]/page.js         Agent details page
  api/agents/route.js         Server-side proxy: list agents
  api/agents/[id]/route.js    Server-side proxy: one agent
  components/                 Shared UI pieces
lib/agentApi.js               Client-side fetch helpers (call our own /api routes)
```

If you ever need to point at a different backend, just change `API_BASE` in
the two route files under `app/api/`.
