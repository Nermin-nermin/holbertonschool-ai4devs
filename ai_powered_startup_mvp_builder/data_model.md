# Data Model - HireLine MVP

The MVP stores data in PostgreSQL (Neon). Two tables are implemented today (`requests`, `messages`); `users` and `applications` are designed now so the schema can grow without breaking changes when authentication is added.

## Entity-relationship diagram

```
┌────────────────────┐ 1        * ┌────────────────────┐
│       users        │────────────│     requests       │
│ (planned, post-MVP)│  posts     │   (job postings)   │
└─────────┬──────────┘            └─────────┬──────────┘
          │ 1                         1 │        │ 1
          │                               │        │
          │ *                         * │        │ *
┌─────────┴──────────┐            ┌─────────┴──────────┐
│    applications    │            │      messages      │
│ (planned, post-MVP)│            │  (chat per job)    │
└────────────────────┘            └────────────────────┘
   users 1─* applications *─1 requests
```

## Entity 1: `requests` (job postings) - implemented

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Unique job id |
| `title` | TEXT | NOT NULL | Job title, e.g. "Junior AI Engineer" |
| `company` | TEXT | NOT NULL | Hiring company |
| `location` | TEXT | NOT NULL DEFAULT `''` | City or "Remote" |
| `description` | TEXT | NOT NULL, ≥ 10 chars (validated in API) | Role details |
| `contact` | TEXT | valid email (validated in API) | Where candidates apply |
| `status` | TEXT | NOT NULL DEFAULT `'open'`, one of `open`/`filled` | Availability |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT `now()` | Used for newest-first sorting |
| `user_id` *(post-MVP)* | INTEGER | FK → users.id, nullable | Owner who can change status |

## Entity 2: `messages` (chat) - implemented

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Monotonic id, used as the polling cursor (`after=`) |
| `request_id` | INTEGER | NOT NULL, FK → requests.id ON DELETE CASCADE | Which job thread |
| `author` | TEXT | NOT NULL | Display name chosen by the user |
| `body` | TEXT | NOT NULL, non-empty | Message text |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT `now()` | Shown as message time |

Planned index (add when traffic grows): `(request_id, id)` - supports the polling query `WHERE request_id = $1 AND id > $2 ORDER BY id`.

## Entity 3: `users` - designed, planned for post-MVP auth

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `email` | TEXT | UNIQUE NOT NULL | Login via magic link |
| `display_name` | TEXT | NOT NULL | Replaces free-text chat author |
| `role` | TEXT | `employer` or `candidate` | Controls permissions |
| `created_at` | TIMESTAMPTZ | DEFAULT `now()` | |

## Entity 4: `applications` - designed, planned for post-MVP

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `request_id` | INTEGER | FK → requests.id ON DELETE CASCADE | Job applied to |
| `user_id` | INTEGER | FK → users.id | Candidate |
| `status` | TEXT | `submitted`/`reviewed`/`rejected`/`hired` | Pipeline stage |
| `created_at` | TIMESTAMPTZ | DEFAULT `now()` | |
| | | UNIQUE (`request_id`, `user_id`) | One application per job per candidate |

## Relationships
- One **request** has many **messages** (1:N); deleting a job deletes its chat (cascade).
- One **user** posts many **requests** (1:N, post-MVP).
- **Users** and **requests** are linked many-to-many through **applications** (post-MVP).

## SQL (implemented tables)

```sql
CREATE TABLE IF NOT EXISTS requests (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  company     TEXT NOT NULL,
  location    TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  contact     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  request_id  INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  author      TEXT NOT NULL,
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
