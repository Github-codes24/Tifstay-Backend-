const { verifyToken } = require('../utils/jwt');

function auth(requiredRole) {
  return (req, _res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) throw new Error('No token provided');
      const payload = verifyToken(token);
      req.user = { id: payload.id, role: payload.role };
      if (requiredRole && payload.role !== requiredRole) {
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
      }
      next();
    } catch (err) {
      err.status = err.status || 401;
      next(err);
    }
  };
}

module.exports = { auth };
