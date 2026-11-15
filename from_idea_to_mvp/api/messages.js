// GET  /api/messages?requestId=3&after=12 -> messages for a request newer than id 12 (used for live polling)
// POST /api/messages?requestId=3          -> send a message {author, body}
const db = require('../lib/db');
const { validateMessage, readJson, send } = require('../lib/validate');

module.exports = async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const requestId = Number(url.searchParams.get('requestId'));
    if (!requestId) return send(res, 400, { error: 'requestId is required' });
    if (!(await db.getRequest(requestId))) return send(res, 404, { error: 'Request not found' });

    if (req.method === 'GET') {
      const after = Number(url.searchParams.get('after')) || 0;
      return send(res, 200, await db.listMessages(requestId, after));
    }

    if (req.method === 'POST') {
      const { data, errors } = validateMessage(await readJson(req));
      if (Object.keys(errors).length) return send(res, 400, { errors });
      return send(res, 201, await db.createMessage(requestId, data.author, data.body));
    }

    res.setHeader('Allow', 'GET, POST');
    return send(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    console.error('messages API error:', err);
    return send(res, 500, { error: 'Server error, please try again' });
  }
};
