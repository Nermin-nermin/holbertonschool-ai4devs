'use strict';
// GET /api/jobs/search?q=&status=&limit=&page=&sort=
// Thin HTTP layer: parse -> validate -> query -> respond.
const { parseSearchParams, searchJobs } = require('./search');

function createSearchHandler(db) {
  return async function handler(req, res) {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return send(res, 405, { error: 'Method not allowed' });
    }
    const parsed = parseSearchParams(req.query || {});
    if (!parsed.ok) return send(res, 400, { errors: parsed.errors });
    try {
      const jobs = await db.listRequests();
      return send(res, 200, searchJobs(jobs, parsed.value));
    } catch (err) {
      console.error('search failed', err);
      return send(res, 500, { error: 'Internal error' });
    }
  };
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

module.exports = { createSearchHandler };
