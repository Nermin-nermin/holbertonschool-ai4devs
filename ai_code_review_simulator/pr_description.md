# Pull Request: Add Server-side Job Search with Filtering and Pagination

## Summary
HireLine currently downloads **every** job to the browser and filters them client-side. That gets slow as the board grows and makes it impossible to share a search link. This PR adds a server-side search module and a `GET /api/jobs/search` handler that supports free-text search, status filtering, sorting and pagination, with strict parameter validation and per-field error messages.

```
GET /api/jobs/search?q=ai%20baku&status=open&sort=newest&limit=20&page=1

200 OK
{ "items": [...], "total": 2, "page": 1, "limit": 20,
  "totalPages": 1, "hasNext": false, "hasPrev": false }
```

| Param | Default | Rules |
|---|---|---|
| `q` | `""` | trimmed, max 100 chars; multi-word = AND match on title, company, location, description (case-insensitive) |
| `status` | `open` | `open`, `filled` or `all` |
| `sort` | `newest` | `newest` or `oldest` (by `created_at`) |
| `limit` | `20` | integer 1–100 |
| `page` | `1` | integer ≥ 1 |

## Changes
- **Added `src/search.js`** (79 lines): pure functions
  - `parseSearchParams()` - parses and validates query params, returns `{ ok, value }` or `{ ok: false, errors }`
  - `matchesQuery()` - multi-term, case-insensitive AND matching
  - `searchJobs()` - filter → sort → paginate, returns items plus pagination metadata
- **Added `src/searchHandler.js`** (31 lines): thin HTTP layer via `createSearchHandler(db)` (dependency injection so it can be tested with a fake DB); returns 200 / 400 (validation) / 405 (non-GET, sets `Allow`) / 500 (logged); `Cache-Control: no-store`.
- **Added `test/search.test.js`** (56 lines): 6 tests covering defaults, AND search, status + sort, pagination metadata, validation errors and handler status codes.
- **Added `package.json`** with `npm test` (Node built-in test runner, no new dependencies).

**Total: ~166 LOC** (110 feature + 56 tests).

## Context
- **Motivation:** user stories 4 and 5 in `ai_powered_startup_mvp_builder/user_stories.md` (search and status filter). Moving them server-side is the next step for scaling past a few hundred posts and for shareable search URLs.
- **Related issue:** HireLine backlog - "Search should work without loading all jobs" (no GitHub issue number; tracked in the MVP plan).
- **Design choice:** logic is kept as pure functions over an array so it can be unit-tested without a database. A follow-up can push filtering into SQL (`ILIKE` + `LIMIT/OFFSET`) behind the same `parseSearchParams` contract.

## Testing
```
$ npm test
# tests 6
# pass 6
# fail 0
```
All existing HireLine tests (`from_idea_to_mvp/test/api.test.js`, 5 tests) are unaffected because this PR adds new files only.

## Checklist
- [x] New feature ~100–200 LOC
- [x] Input validation with clear error messages
- [x] Unit tests added and passing
- [x] No new dependencies
- [ ] Wire `/api/jobs/search` into the Vercel `api/` folder and the frontend (follow-up PR)
