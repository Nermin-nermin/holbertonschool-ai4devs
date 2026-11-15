// Data layer: Postgres (Neon) when DATABASE_URL is set, in-memory fallback for local tests.
const { neon } = (() => {
  try { return require('@neondatabase/serverless'); } catch { return {}; }
})();

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const sql = url && neon ? neon(url) : null;

const mem = { requests: [], messages: [], nextReq: 1, nextMsg: 1 };
let ready = null;

async function init() {
  if (!sql) return;
  if (!ready) {
    ready = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS requests (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL,
        contact TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
        author TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    })();
  }
  return ready;
}

async function listRequests() {
  await init();
  if (sql) return sql`SELECT * FROM requests ORDER BY created_at DESC LIMIT 100`;
  return [...mem.requests].reverse();
}

async function getRequest(id) {
  await init();
  if (sql) return (await sql`SELECT * FROM requests WHERE id = ${id}`)[0] || null;
  return mem.requests.find((r) => r.id === id) || null;
}

async function createRequest({ title, company, location, description, contact }) {
  await init();
  if (sql) {
    return (await sql`INSERT INTO requests (title, company, location, description, contact)
      VALUES (${title}, ${company}, ${location}, ${description}, ${contact}) RETURNING *`)[0];
  }
  const row = { id: mem.nextReq++, title, company, location, description, contact, status: 'open', created_at: new Date().toISOString() };
  mem.requests.push(row);
  return row;
}

async function updateStatus(id, status) {
  await init();
  if (sql) return (await sql`UPDATE requests SET status = ${status} WHERE id = ${id} RETURNING *`)[0] || null;
  const r = mem.requests.find((x) => x.id === id);
  if (r) r.status = status;
  return r || null;
}

async function listMessages(requestId, afterId) {
  await init();
  if (sql) {
    return sql`SELECT * FROM messages WHERE request_id = ${requestId} AND id > ${afterId} ORDER BY id ASC LIMIT 200`;
  }
  return mem.messages.filter((m) => m.request_id === requestId && m.id > afterId);
}

async function createMessage(requestId, author, body) {
  await init();
  if (sql) {
    return (await sql`INSERT INTO messages (request_id, author, body)
      VALUES (${requestId}, ${author}, ${body}) RETURNING *`)[0];
  }
  const row = { id: mem.nextMsg++, request_id: requestId, author, body, created_at: new Date().toISOString() };
  mem.messages.push(row);
  return row;
}

module.exports = { listRequests, getRequest, createRequest, updateStatus, listMessages, createMessage, usingDatabase: !!sql };
