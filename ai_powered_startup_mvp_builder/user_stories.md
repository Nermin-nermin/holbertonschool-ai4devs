# User Stories - HireLine

Format: *As a <role>, I want <goal> so that <benefit>.* Each story has acceptance criteria and a priority (MoSCoW).

## User Story 1 - Post a job
As a hiring manager, I want to post a job with a title, company, location, description and contact email so that candidates can find my vacancy in one place.
- **Acceptance criteria:** the form has these 5 fields; on success the job appears at the top of the board with status "Open"; a confirmation message is shown.
- **Priority:** Must

## User Story 2 - Validation feedback
As a hiring manager, I want clear error messages when I leave a required field empty or type an invalid email so that I can fix my post before publishing.
- **Acceptance criteria:** title and company are required, description needs at least 10 characters, contact must be a valid email; errors are shown next to each field and nothing is saved until all pass (API returns 400 with per-field errors).
- **Priority:** Must

## User Story 3 - Browse jobs
As a job seeker, I want to see all job postings, newest first, so that I can quickly find recent opportunities.
- **Acceptance criteria:** the Jobs tab loads every job with title, company, location, date, description and contact; an empty state is shown when there are none.
- **Priority:** Must

## User Story 4 - Search jobs
As a job seeker, I want to search by title, company or location so that I only see roles relevant to me.
- **Acceptance criteria:** typing in the search box filters the list instantly (case-insensitive) without reloading the page.
- **Priority:** Should

## User Story 5 - Filter by status
As a job seeker, I want to filter jobs by Open, Filled or All so that I do not waste time on roles that are already taken.
- **Acceptance criteria:** the default filter is Open; switching filters updates the list instantly.
- **Priority:** Should

## User Story 6 - Mark a job as filled
As a hiring manager, I want to mark my job as filled (or reopen it) with one click so that candidates know whether it is still available.
- **Acceptance criteria:** the button toggles status between open and filled via `PATCH /api/requests?id=`; the badge colour and text update; invalid status values are rejected.
- **Priority:** Must

## User Story 7 - Chat about a job
As a job seeker, I want to open a chat thread for a specific job so that I can ask the poster a question before applying.
- **Acceptance criteria:** "Chat about this job" opens the Chat tab with that job selected; each job has its own separate thread.
- **Priority:** Must

## User Story 8 - Choose a display name
As a chat participant, I want to enter a display name before sending messages so that others know who is talking.
- **Acceptance criteria:** a message cannot be sent without a name; the name is remembered in the browser (localStorage) for next time; my own messages are visually distinguished.
- **Priority:** Must

## User Story 9 - Real-time messages
As a chat participant, I want new messages to appear automatically without refreshing so that the conversation feels live.
- **Acceptance criteria:** a message sent in one browser appears in another browser within about 3 seconds; only new messages are fetched (`after=<lastId>`); a "Live" indicator is shown while polling works.
- **Priority:** Must

## User Story 10 - Message history persists
As a hiring manager, I want chat history to be saved so that I can come back later and answer questions I missed.
- **Acceptance criteria:** messages are stored in PostgreSQL with author and timestamp; after a reload or from another device the full thread is shown in order.
- **Priority:** Must

## User Story 11 - Mobile use
As a job seeker on my phone, I want the board and chat to be readable and usable on a small screen so that I can browse and reply on the go.
- **Acceptance criteria:** at 375px width no horizontal scrolling is needed; cards stack in one column; chat input and buttons remain reachable.
- **Priority:** Should

## User Story 12 - Keyboard accessibility
As a keyboard or screen-reader user, I want to switch tabs with the keyboard and hear updates announced so that I can use the app without a mouse.
- **Acceptance criteria:** tabs use ARIA roles and arrow-key navigation; focus outlines are visible; job list and messages use `aria-live="polite"`.
- **Priority:** Could
