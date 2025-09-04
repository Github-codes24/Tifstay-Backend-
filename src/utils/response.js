function ok(res, data = {}, code = 200) {
  return res.status(code).json({ success: true, ...data });
}

function created(res, data = {}) {
  return ok(res, data, 201);
}

function error(res, message = "Error", code = 400) {
  return res.status(code).json({ success: false, message });
}

module.exports = { ok, created, error };
