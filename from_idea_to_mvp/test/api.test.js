// API tests using the in-memory store (run: npm test). No database needed.
const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const requests = require('../api/requests');
const messages = require('../api/messages');

function call(handler, method, url, body) {
  return new Promise((resolve) => {
    const req = Readable.from(body ? [Buffer.from(JSON.stringify(body))] : []);
    Object.assign(req, { method, url, headers: {} });
    const res = {
      statusCode: 200, headers: {},
      setHeader(k, v) { this.headers[k] = v; },
      end(payload) { resolve({ status: this.statusCode, body: JSON.parse(payload) }); },
    };
    handler(req, res);
  });
}

const job = { title: 'Junior Data Analyst', company: 'Araz', location: 'Baku', description: 'SQL, Excel and dashboards.', contact: 'hr@araz.az' };

test('rejects an invalid job request with field errors', async () => {
  const r = await call(requests, 'POST', '/api/requests', { title: '', company: 'X', description: 'short', contact: 'not-an-email' });
  assert.equal(r.status, 400);
  assert.deepEqual(Object.keys(r.body.errors).sort(), ['contact', 'description', 'title']);
});

test('creates, lists and fetches a job request', async () => {
  const created = await call(requests, 'POST', '/api/requests', job);
  assert.equal(created.status, 201);
  assert.equal(created.body.status, 'open');
  const list = await call(requests, 'GET', '/api/requests');
  assert.ok(list.body.some((j) => j.id === created.body.id));
  const one = await call(requests, 'GET', '/api/requests?id=' + created.body.id);
  assert.equal(one.body.title, job.title);
});

test('updates status and rejects unknown status', async () => {
  const { body } = await call(requests, 'POST', '/api/requests', job);
  const ok = await call(requests, 'PATCH', '/api/requests?id=' + body.id, { status: 'filled' });
  assert.equal(ok.body.status, 'filled');
  const bad = await call(requests, 'PATCH', '/api/requests?id=' + body.id, { status: 'deleted' });
  assert.equal(bad.status, 400);
});

test('chat: sends messages and polls only newer ones', async () => {
  const { body: j } = await call(requests, 'POST', '/api/requests', job);
  const m1 = await call(messages, 'POST', '/api/messages?requestId=' + j.id, { author: 'Narmin', body: 'Is this role remote?' });
  const m2 = await call(messages, 'POST', '/api/messages?requestId=' + j.id, { author: 'HR', body: 'Hybrid: 3 days in Baku.' });
  assert.equal(m1.status, 201);
  const all = await call(messages, 'GET', '/api/messages?requestId=' + j.id + '&after=0');
  assert.equal(all.body.length, 2);
  const newer = await call(messages, 'GET', '/api/messages?requestId=' + j.id + '&after=' + m1.body.id);
  assert.deepEqual(newer.body.map((m) => m.id), [m2.body.id]);
});

test('chat: validates messages and unknown jobs', async () => {
  const { body: j } = await call(requests, 'POST', '/api/requests', job);
  const empty = await call(messages, 'POST', '/api/messages?requestId=' + j.id, { author: '', body: '' });
  assert.equal(empty.status, 400);
  const missing = await call(messages, 'GET', '/api/messages?requestId=99999');
  assert.equal(missing.status, 404);
});
