// src/controllers/auth.controller.js
const AuthService = require('../services/auth.service');
const { signToken } = require('../utils/jwt');
const { ok, created, serverError, badRequest } = require('../utils/response');
const nodemailer = require('nodemailer');

function getTokenForUser(user) {
  return signToken({ id: user._id, email: user.email });
}

async function sendResetEmail(email, token) {
  // Basic transporter using environment SMTP or console fallback
  if (process.env.SMTP_HOST) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@example.com',
      to: email,
      subject: 'Password reset',
      text: `Reset your password: ${resetUrl}`,
      html: `<p>Click to reset password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
    });
  } else {
    // dev: log to console
    console.log('Password reset link (dev):', `${process.env.FRONTEND_URL}/reset-password/${token}`);
  }
}

exports.register = async (req, res) => {
  try {
    const user = await AuthService.registerLocal(req.body);
    const token = getTokenForUser(user);
    return created(res, { data: { user, token } });
  } catch (err) { return serverError(res, err.message); }
};

exports.login = async (req, res) => {
  try {
    const user = await AuthService.loginLocal(req.body);
    const token = getTokenForUser(user);
    return ok(res, { data: { user, token } });
  } catch (err) { return badRequest(res, err.message); }
};

exports.google = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return badRequest(res, 'idToken required');
    const user = await AuthService.googleLogin(idToken);
    const token = getTokenForUser(user);
    return ok(res, { data: { user, token } });
  } catch (err) { return serverError(res, err.message); }
};

exports.forgot = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return badRequest(res, 'email required');
    const { user, token } = await AuthService.requestPasswordReset(email);
    await sendResetEmail(email, token);
    return ok(res, { message: 'Password reset link sent' });
  } catch (err) { return serverError(res, err.message); }
};

exports.reset = async (req, res) => {
  try {
    const { token } = req.params; // token in URL
    const { newPassword } = req.body;
    if (!newPassword) return badRequest(res, 'newPassword required');
    const user = await AuthService.resetPassword(token, newPassword);
    const jwtToken = getTokenForUser(user);
    return ok(res, { data: { user, token: jwtToken }, message: 'Password reset success' });
  } catch (err) { return serverError(res, err.message); }
};
