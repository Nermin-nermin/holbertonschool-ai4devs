'use strict';
// Server-side search, filtering and pagination for HireLine job postings.
// Pure functions: easy to unit-test and reusable by the API handler.

const ALLOWED_STATUS = ['open', 'filled', 'all'];
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parse and validate query-string parameters.
 * Returns { ok: true, value } or { ok: false, errors }.
 */
function parseSearchParams(query = {}) {
  const errors = {};
  const q = typeof query.q === 'string' ? query.q.trim().slice(0, 100) : '';

  const status = (query.status || 'open').toLowerCase();
  if (!ALLOWED_STATUS.includes(status)) {
    errors.status = `status must be one of: ${ALLOWED_STATUS.join(', ')}`;
  }

  const limit = query.limit === undefined ? DEFAULT_LIMIT : Number(query.limit);
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    errors.limit = `limit must be an integer between 1 and ${MAX_LIMIT}`;
  }

  const page = query.page === undefined ? 1 : Number(query.page);
  if (!Number.isInteger(page) || page < 1) {
    errors.page = 'page must be a positive integer';
  }

  const sort = query.sort === 'oldest' ? 'oldest' : 'newest';

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { q, status, limit, page, sort } };
}

/** Case-insensitive match on title, company, location and description. */
function matchesQuery(job, q) {
  if (!q) return true;
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [job.title, job.company, job.location, job.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return terms.every((t) => haystack.includes(t)); // AND semantics
}

/**
 * Filter, sort and paginate an array of jobs.
 * Returns { items, total, page, limit, totalPages, hasNext, hasPrev }.
 */
function searchJobs(jobs, params) {
  const { q, status, limit, page, sort } = params;
  const filtered = jobs
    .filter((j) => status === 'all' || j.status === status)
    .filter((j) => matchesQuery(j, q))
    .sort((a, b) => {
      const diff = new Date(b.created_at) - new Date(a.created_at);
      return sort === 'newest' ? diff : -diff;
    });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

module.exports = { parseSearchParams, matchesQuery, searchJobs, ALLOWED_STATUS, DEFAULT_LIMIT, MAX_LIMIT };
