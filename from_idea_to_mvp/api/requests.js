// GET  /api/requests            -> list job requests (newest first)
// GET  /api/requests?id=3       -> one request
// POST /api/requests            -> create a request {title, company, location, description, contact}
// PATCH /api/requests?id=3      -> update status {status: "open" | "filled"}
const db = require('../lib/db');
const { validateRequest, readJson, send } = require('../lib/validate');

module.exports = async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const id = Number(url.searchParams.get('id'));

    if (req.method === 'GET') {
      if (id) {
        const row = await db.getRequest(id);
        return row ? send(res, 200, row) : send(res, 404, { error: 'Request not found' });
      }
      return send(res, 200, await db.listRequests());
    }

    if (req.method === 'POST') {
      const { data, errors } = validateRequest(await readJson(req));
      if (Object.keys(errors).length) return send(res, 400, { errors });
      return send(res, 201, await db.createRequest(data));
    }

    if (req.method === 'PATCH') {
      const body = await readJson(req);
      if (!id || !['open', 'filled'].includes(body.status)) return send(res, 400, { error: 'id and status (open|filled) are required' });
      const row = await db.updateStatus(id, body.status);
      return row ? send(res, 200, row) : send(res, 404, { error: 'Request not found' });
    }

    res.setHeader('Allow', 'GET, POST, PATCH');
    return send(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    console.error('requests API error:', err);
    return send(res, 500, { error: 'Server error, please try again' });
  }
};
