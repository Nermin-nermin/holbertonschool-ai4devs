'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { parseSearchParams, searchJobs, matchesQuery } = require('../src/search');
const { createSearchHandler } = require('../src/searchHandler');

const jobs = [
  { id: 1, title: 'Junior AI Engineer', company: 'Araz', location: 'Baku', description: 'LLM features', status: 'open', created_at: '2026-11-01T10:00:00Z' },
  { id: 2, title: 'Data Analyst', company: 'Bazardone', location: 'Remote', description: 'SQL and dashboards', status: 'filled', created_at: '2026-11-02T10:00:00Z' },
  { id: 3, title: 'Senior AI Engineer', company: 'Cothink', location: 'Baku', description: 'NLP for Azerbaijani', status: 'open', created_at: '2026-11-03T10:00:00Z' },
];
const ok = (q) => parseSearchParams(q).value;

test('defaults: open jobs, newest first, page 1 of 20', () => {
  assert.deepStrictEqual(ok({}), { q: '', status: 'open', limit: 20, page: 1, sort: 'newest' });
  const r = searchJobs(jobs, ok({}));
  assert.deepStrictEqual(r.items.map((j) => j.id), [3, 1]);
  assert.strictEqual(r.total, 2);
});

test('multi-word query uses AND semantics, case-insensitive', () => {
  assert.ok(matchesQuery(jobs[0], 'ai BAKU'));
  assert.ok(!matchesQuery(jobs[1], 'ai baku'));
  assert.deepStrictEqual(searchJobs(jobs, ok({ q: 'engineer baku', status: 'all' })).items.map((j) => j.id), [3, 1]);
});

test('status=all and sort=oldest', () => {
  const r = searchJobs(jobs, ok({ status: 'all', sort: 'oldest' }));
  assert.deepStrictEqual(r.items.map((j) => j.id), [1, 2, 3]);
});

test('pagination metadata', () => {
  const r = searchJobs(jobs, ok({ status: 'all', limit: '2', page: '2' }));
  assert.deepStrictEqual(r.items.map((j) => j.id), [1]);
  assert.strictEqual(r.totalPages, 2);
  assert.strictEqual(r.hasNext, false);
  assert.strictEqual(r.hasPrev, true);
});

test('invalid params return per-field errors', () => {
  const r = parseSearchParams({ status: 'closed', limit: '500', page: '0' });
  assert.strictEqual(r.ok, false);
  assert.deepStrictEqual(Object.keys(r.errors).sort(), ['limit', 'page', 'status']);
});

test('handler: 200, 400 and 405', async () => {
  const handler = createSearchHandler({ listRequests: async () => jobs });
  const call = async (req) => {
    const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(b) { this.body = JSON.parse(b); } };
    await handler(req, res);
    return res;
  };
  assert.strictEqual((await call({ method: 'GET', query: { q: 'data', status: 'all' } })).body.total, 1);
  assert.strictEqual((await call({ method: 'GET', query: { limit: 'abc' } })).statusCode, 400);
  assert.strictEqual((await call({ method: 'POST' })).statusCode, 405);
});
