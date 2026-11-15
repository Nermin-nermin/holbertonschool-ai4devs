# HireLine – Job Board with Real-time Chat (MVP)

Holberton project *From Idea to MVP with AI: Building a Job Board with Real-time Chat*.

> **Platform note:** the project was designed for Val Town / Townie AI, but Val Town closed new sign-ups on 10 Nov 2026 and is shutting down (blog.val.town/winding-down). The same MVP is built here on **Vercel** (the hosting provider Val Town recommends migrating to), with a **Neon Postgres** database.

## Features
| Course task | Implementation |
|---|---|
| Assistance request app | "Post a job" form → `POST /api/requests`, with server-side validation (title, company, description ≥ 10 chars, valid email) and inline errors |
| Data persistence | Requests and messages stored in Postgres (`requests`, `messages` tables created automatically). Falls back to an in-memory store when no database is configured (local tests) |
| Real-time support chat | One chat room per job; the browser polls `GET /api/messages?requestId=…&after=<lastId>` every 2 s, so it only downloads new messages. Polling pauses when the tab is hidden |
| Enhanced UI | Sticky header, accessible tabs (Jobs / Post a job / Chat, arrow-key navigation), search + status filter, open/filled status, hover states, mobile layout, reduced-motion support |
| Testing & deployment | `npm test` (5 API tests) + browser end-to-end test; deployed on Vercel |

## API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/requests` | List jobs (newest first) |
| GET | `/api/requests?id=3` | One job |
| POST | `/api/requests` | Create a job `{title, company, location, description, contact}` |
| PATCH | `/api/requests?id=3` | Set status `{status: "open" \| "filled"}` |
| GET | `/api/messages?requestId=3&after=12` | Messages newer than id 12 |
| POST | `/api/messages?requestId=3` | Send `{author, body}` |

## Run and test
```bash
npm install
npm test            # API tests with the in-memory store
```
Deploy: import the repo in Vercel with **Root Directory = `from_idea_to_mvp`**, add a Neon Postgres database from the Vercel Storage tab (it sets `DATABASE_URL`), then deploy.

## Structure
```
index.html          # single-page UI (tabs, form, live chat)
api/requests.js     # job requests API
api/messages.js     # chat API
lib/db.js           # Postgres / in-memory data layer
lib/validate.js     # validation + JSON helpers
test/api.test.js    # node:test API tests
```
