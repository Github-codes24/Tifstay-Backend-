const { verifyToken } = require('../utils/jwt');
const User = require('../models/user.model');

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token user' });
    }

    req.user = {
      id: user._id,
      email: user.email,
      profile: user.profile,
      provider: user.provider
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      error: err.message
    });
  }
}

module.exports = auth;
