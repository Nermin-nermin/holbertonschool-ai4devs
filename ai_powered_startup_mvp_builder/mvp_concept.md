# MVP Concept - HireLine: Job Board with Real-time Chat

## Problem Statement
Small companies and startups in Baku post vacancies on social media and generic job sites, then lose candidates in scattered DMs, emails and phone calls. Candidates have no quick way to ask a clarifying question ("Is it remote?", "Is the salary negotiable?") before applying, and employers have no single place to see open roles and the conversations attached to them. The result is slow hiring, duplicate questions and roles that stay "open" long after they are filled.

**Hypothesis:** if every job post has its own lightweight, real-time chat thread and a clear Open/Filled status, employers will fill roles faster and candidates will apply with fewer unanswered questions.

## Target Users
- Founders and hiring managers at small companies and startups (1–50 employees) who post 1–5 roles at a time
- Job seekers (students, bootcamp graduates, junior developers) who want to ask a question before applying
- Recruiters who manage several open positions and need a quick overview of what is still open

## Core Features
1. **Post a job** - form with title, company, location, description and contact email; server-side validation with clear inline error messages.
2. **Job board** - list of all postings, newest first, with instant search (title, company, location) and an Open / Filled / All status filter.
3. **Per-job real-time chat** - each job has its own chat thread; users pick a display name and messages appear for everyone within about 2 seconds without a page refresh.
4. **Mark as filled / reopen** - one click changes a job's status so candidates stop applying to closed roles.
5. **Persistence** - jobs and messages are stored in PostgreSQL, so they survive reloads, new sessions and redeploys.
6. **Responsive, accessible UI** - tab-based navigation (Jobs, Post a job, Chat) with keyboard support, usable on phones and desktops.

## Constraints
- **No authentication** in the MVP: anyone can post, chat or change a job's status (acceptable for a closed pilot; login is the first post-MVP feature).
- **Polling, not WebSockets:** Vercel serverless functions cannot hold open sockets, so chat uses 2-second polling with `?after=<lastId>`; fine for tens of concurrent users, not thousands.
- **Free-tier infrastructure:** Vercel Hobby + Neon Postgres free plan (1 GB storage, limited compute hours).
- **No file uploads** (no CVs/attachments) and **no email notifications** in the MVP.
- **Single language (English)** and no payment/premium listings.
- **Timeline:** one-week build sprint by a single developer using AI assistants (Claude Code, v0).

## Success Metrics (pilot)
- A new job can be posted in under 1 minute.
- Chat messages are visible to a second user in under 3 seconds.
- At least 5 pilot companies post a role and at least 50% of posts receive a chat message within 48 hours.

## Live MVP
- App: https://hireline-job-board.vercel.app
- Code: `from_idea_to_mvp/` in this repository
