const jwt = require('jsonwebtoken');

const config = {
  secret: process.env.JWT_SECRET || 'changeme',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

function signToken(payload) {
  return jwt.sign(payload, config.secret, { expiresIn: config.expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, config.secret);
}

module.exports = { signToken, verifyToken };
