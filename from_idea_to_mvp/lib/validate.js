// Shared input validation and request-body parsing for the API routes.
function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function validateRequest(body) {
  const data = {
    title: clean(body.title, 120),
    company: clean(body.company, 120),
    location: clean(body.location, 120),
    description: clean(body.description, 2000),
    contact: clean(body.contact, 200),
  };
  const errors = {};
  if (!data.title) errors.title = 'Job title is required';
  if (!data.company) errors.company = 'Company is required';
  if (data.description.length < 10) errors.description = 'Description must be at least 10 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact)) errors.contact = 'A valid contact email is required';
  return { data, errors };
}

function validateMessage(body) {
  const data = { author: clean(body.author, 60), body: clean(body.body, 1000) };
  const errors = {};
  if (!data.author) errors.author = 'Name is required';
  if (!data.body) errors.body = 'Message cannot be empty';
  return { data, errors };
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

module.exports = { validateRequest, validateMessage, readJson, send };
