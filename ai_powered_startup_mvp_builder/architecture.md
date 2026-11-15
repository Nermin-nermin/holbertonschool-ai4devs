# Architecture - HireLine MVP

## High-level system diagram

```
                    ┌─────────────────────────────────────────────┐
                    │               Browser (SPA)                 │
                    │   index.html - vanilla JS + CSS             │
                    │   ┌────────┐   ┌────────────┐   ┌────────┐  │
                    │   │  Jobs  │   │ Post a job │   │  Chat  │  │
                    │   └───┬────┘   └─────┬──────┘   └───┬────┘  │
                    │       │ fetch()      │ fetch()      │ poll  │
                    └───────┼──────────────┼──────────────┼───────┘
                            │ HTTPS / JSON │              │
                            ▼              ▼              ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                      Vercel (Hobby) - static hosting + CDN                    │
│                                                                               │
│   /index.html  (static)                                                       │
│                                                                               │
│   Serverless Functions (Node.js)                                              │
│   ┌──────────────────────────────┐     ┌──────────────────────────────────┐   │
│   │ api/requests.js              │     │ api/messages.js                  │   │
│   │  GET    list / ?id=          │     │  GET  ?requestId=&after=lastId   │   │
│   │  POST   create (validate)    │     │  POST ?requestId=  {author,body} │   │
│   │  PATCH  ?id= {status}        │     │                                  │   │
│   └──────────────┬───────────────┘     └────────────────┬─────────────────┘   │
│                  │        lib/validate.js (input rules, JSON helpers)         │
│                  └──────────────┬───────────────────────┘                     │
│                                 │  lib/db.js (data-access layer)              │
└─────────────────────────────────┼─────────────────────────────────────────────┘
                                  │ SQL over HTTPS (@neondatabase/serverless)
                                  │ DATABASE_URL env var
                                  ▼
                    ┌───────────────────────────────┐
                    │   Neon PostgreSQL (free tier) │
                    │   tables: requests, messages  │
                    └───────────────────────────────┘

        GitHub (holbertonschool-ai4devs) ── push to main ──▶ Vercel auto-deploy
```

## Components

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | Single `index.html`, vanilla JS, CSS | Tabs, forms, rendering, search/filter, chat polling, localStorage for display name |
| API | Vercel serverless functions (Node.js) | REST endpoints, validation, status codes (200/201/400/404/405/500) |
| Validation | `lib/validate.js` | Required fields, min length, email format, JSON body parsing |
| Data access | `lib/db.js` | SQL queries, auto-creates tables on first call; in-memory fallback when no `DATABASE_URL` (local dev/tests) |
| Database | Neon PostgreSQL | Durable storage of jobs and messages |
| CI/CD | GitHub → Vercel | Every push to `main` builds and deploys; env vars injected by the Neon integration |
| Tests | `node:test` + Playwright | API unit tests (5) and an end-to-end two-user chat test |

## Key flows

**Post a job**
```
User fills form → POST /api/requests → validate.js
   ├─ invalid → 400 {errors:{field:msg}} → inline errors in form
   └─ valid   → db.createRequest() → INSERT INTO requests → 201 {job} → board reloads
```

**Real-time chat (polling)**
```
Browser A: POST /api/messages?requestId=7 {author, body} → INSERT INTO messages
Browser B: every 2 s → GET /api/messages?requestId=7&after=<lastId>
           → SELECT ... WHERE request_id=7 AND id > lastId ORDER BY id
           → append only new rows → update lastId
Polling pauses when the Chat tab or the browser tab is hidden.
```

## Design decisions and trade-offs
- **Polling instead of WebSockets:** serverless functions are short-lived, so persistent sockets are not available on Vercel Hobby. Incremental polling (`after=lastId`) keeps payloads tiny and was simple to build and test. Upgrade path: a hosted pub/sub (e.g. Ably/Pusher) or Postgres LISTEN/NOTIFY on a long-running server.
- **No framework on the frontend:** one HTML file loads instantly, has no build step and is easy for AI tools to edit; React/Next.js would be the next step if the UI grows.
- **Serverless Postgres (Neon):** HTTP-based driver works inside serverless functions without connection-pool exhaustion.
- **No auth (MVP constraint):** keeps the sprint small; planned next with magic-link login so only the poster can mark a job as filled.

## Security and reliability notes
- All user content is HTML-escaped before rendering (prevents XSS).
- Parameterised SQL queries only (prevents SQL injection).
- `Cache-Control: no-store` on API responses so chat never shows stale data.
- Secrets (`DATABASE_URL`) live in Vercel environment variables, never in the repo.
