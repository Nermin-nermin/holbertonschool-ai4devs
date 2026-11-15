# AI Review Log - PR "Add Server-side Job Search with Filtering and Pagination"

**Reviewer:** Claude (Anthropic, Opus 5.5) acting as an AI code-review assistant
**Files reviewed:** `src/search.js`, `src/searchHandler.js`, `test/search.test.js`
**Method:** three separate review passes, each with a persona prompt (below). Every finding marked *Verified* was reproduced by running the code with Node before it was logged, so the log contains no unconfirmed claims marked as bugs.

### Persona prompts used
1. **Security reviewer:** *"You are an application-security engineer. Review this Node.js endpoint for input-validation gaps, injection, denial-of-service and information-leak risks. Cite line numbers and give a concrete exploit input for each issue."*
2. **Performance reviewer:** *"You are a backend performance engineer. Identify algorithmic and I/O inefficiencies in this search/pagination code, estimate their impact as the table grows to 100k rows, and suggest fixes."*
3. **Maintainability reviewer:** *"You are a senior reviewer focused on readability, API consistency and test coverage. Flag naming problems, inconsistent behaviour and missing tests."*

---

## Inline Comments

### Security persona
1. **`src/search.js` line 17 - crash on repeated query parameter (High, Verified).**
   `(query.status || 'open').toLowerCase()` assumes a string. A request such as `?status=open&status=filled` is parsed by most frameworks as an array, so `.toLowerCase` throws `TypeError: ... is not a function`. In the handler the throw happens *outside* the `try` block (line 12 of `searchHandler.js`), so the request fails with an unhandled error instead of a clean 400.
   *Reproduced:* `parseSearchParams({ status: ['open','filled'] })` → `THROWS: (query.status || "open").toLowerCase is not a function`.
   *Suggested fix:* normalise every param with a helper like `const first = (v) => Array.isArray(v) ? v[0] : v;` and check `typeof === 'string'`.

2. **`src/searchHandler.js` line 12 - parsing runs outside `try/catch` (Medium).**
   Any unexpected throw in `parseSearchParams` bypasses the 500 handler. Move the parse step inside the `try` so all failures return JSON.

3. **`src/search.js` line 22 - permissive number parsing (Low, Verified).**
   `Number()` accepts `"1e1"`, `" 5 "` and `"0x10"`; `limit=1e1` is accepted as `10`. Not exploitable, but surprising for API clients. Use `/^\d+$/.test(value)` before converting.

4. **`src/search.js` line 15 - query length cap is good, but no rate limiting (Low / informational).**
   The 100-char cap on `q` limits CPU per request ✅. Because the endpoint scans every job, repeated requests could still be used to load the server; recommend Vercel's firewall rate-limit rule or a simple per-IP limiter before launch.

### Performance persona
5. **`src/searchHandler.js` line 15 - loads the whole table on every search (High at scale).**
   `db.listRequests()` returns *all* jobs and filtering/pagination happen in memory, so cost is O(n) network + memory per request even when `limit=20`. At 100k rows this would mean megabytes transferred per keystroke. *Suggested fix:* push work into SQL: `WHERE status = $1 AND (title || ' ' || company ...) ILIKE $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4`, plus `SELECT count(*)` for `total`; add an index on `(status, created_at)` and a `pg_trgm` index for `ILIKE`.

6. **`src/search.js` line 59 - `Date` objects created inside the sort comparator (Medium).**
   `new Date(...)` is called twice per comparison, i.e. ~2·n·log n allocations. Pre-compute a numeric timestamp once per job (`Date.parse`) or sort by the ISO string directly, since ISO-8601 strings sort lexicographically.

7. **`src/search.js` line 41 - search terms are re-tokenised for every job (Low).**
   `matchesQuery` splits and lower-cases `q` on each call, so the same work is repeated n times. Tokenise once in `searchJobs` and pass the terms array in.

### Maintainability persona
8. **`src/search.js` line 32 - inconsistent validation for `sort` (Medium, Verified).**
   Invalid `status`/`limit`/`page` return a 400, but `sort=cheapest` is silently replaced with `newest`. Clients cannot tell their parameter was ignored. Validate `sort` the same way (`errors.sort = 'sort must be newest or oldest'`).
   *Reproduced:* `parseSearchParams({ sort: 'cheapest' }).value.sort` → `'newest'`.

9. **`src/search.js` lines 63–65 - page beyond the last page returns an empty, misleading result (Medium, Verified).**
   `page=9` with only 2 jobs returns `items: []`, `totalPages: 1`, `hasPrev: true`. Either clamp to the last page or return 400 `page out of range`, and document the choice.
   *Reproduced:* output `{"items":[],"total":2,"page":9,...,"totalPages":1,"hasNext":false,"hasPrev":true}`.

10. **`src/search.js` line 59 - invalid `created_at` makes sort order undefined (Low, Verified).**
    If a row has a malformed date, `new Date('x')` is `NaN` and the comparator returns `NaN`, so the order depends on the engine. Treat invalid dates as oldest (`|| 0`) or reject them at insert time.

11. **`src/search.js` line 5 - `'all'` mixed into `ALLOWED_STATUS` (Low).**
    `'all'` is a filter keyword, not a job status, but it lives in the same constant that describes statuses. Rename to `STATUS_FILTERS` or keep `JOB_STATUSES = ['open','filled']` separately to avoid someone later saving a job with status `all`.

---

## Global Feedback
- **Overall:** clean, well-separated design. Pure functions plus a thin handler with dependency injection make the logic easy to test, and the per-field error format matches the existing `/api/requests` API. 👍
- **Must fix before merge:** #1 (crash on array params) and #2 (parse outside `try`). Both are small changes.
- **Should fix:** #8 and #9 (consistent validation, out-of-range pages) so the API contract is predictable.
- **Follow-up PR:** #5 (move filtering and pagination into SQL with indexes). The current in-memory version is fine for the MVP's data size but will not scale.
- **Tests to add:** repeated or array parameters, `page` beyond range, `sort` validation, whitespace-only `q`, invalid `created_at`, and a handler test that a throwing DB returns 500 without leaking the error message.
- **Docs:** add the parameter table from the PR description to the README and include an example response for an error (400).

## Summary table

| # | File:line | Persona | Severity | Type | Verified |
|---|---|---|---|---|---|
| 1 | search.js:17 | Security | High | Bug | ✅ |
| 2 | searchHandler.js:12 | Security | Medium | Robustness | - |
| 3 | search.js:22 | Security | Low | Validation | ✅ |
| 4 | search.js:15 | Security | Low | Hardening | - |
| 5 | searchHandler.js:15 | Performance | High (at scale) | Scalability | - |
| 6 | search.js:59 | Performance | Medium | Efficiency | - |
| 7 | search.js:41 | Performance | Low | Efficiency | - |
| 8 | search.js:32 | Maintainability | Medium | API consistency | ✅ |
| 9 | search.js:63–65 | Maintainability | Medium | API contract | ✅ |
| 10 | search.js:59 | Maintainability | Low | Edge case | ✅ |
| 11 | search.js:5 | Maintainability | Low | Naming | - |

**Total: 11 inline comments + 6 global suggestions.**
