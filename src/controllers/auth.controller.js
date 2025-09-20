const AuthService = require('../services/auth.service');
const { signToken } = require('../utils/jwt');
const { ok, created, badRequest, serverError } = require('../utils/response');

function getTokenForUser(user) {
  return signToken({
    id: user._id,
    email: user.email,
    profile: user.profile,
    provider: user.provider
  });
}

// Register
exports.register = async (req, res) => {
  try {
    const user = await AuthService.registerLocal(req.body);
    const token = getTokenForUser(user);
    return created(res, { data: { user, token }, message: 'Registered' });
  } catch (err) {
    return badRequest(res, err.message);
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const user = await AuthService.loginLocal(req.body);
    const token = getTokenForUser(user);
    return ok(res, { data: { user, token }, message: 'Login success' });
  } catch (err) {
    return badRequest(res, err.message);
  }
};

// Google Login
exports.google = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return badRequest(res, 'idToken required');
    const user = await AuthService.googleLogin(idToken);
    const token = getTokenForUser(user);
    return ok(res, { data: { user, token }, message: 'Google login success' });
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Apple Login
exports.apple = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return badRequest(res, 'idToken required');
    const user = await AuthService.appleLogin(idToken);
    const token = getTokenForUser(user);
    return ok(res, { data: { user, token }, message: 'Apple login success' });
  } catch (err) {
    return serverError(res, err.message);
  }
};
