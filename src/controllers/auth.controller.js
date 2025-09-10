// src/controllers/auth.controller.js
const AuthService = require('../services/auth.service');
const { signToken } = require('../utils/jwt');
const { ok, created, serverError, badRequest } = require('../utils/response');
const nodemailer = require('nodemailer');

function getTokenForUser(user) {
  return signToken({ id: user._id, email: user.email, profile: user.profile });
}

async function sendResetEmail(email, token) {
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
      html: `<p>Click to reset password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
    });
  } else {
    console.log('Password reset link (dev):', `${process.env.FRONTEND_URL}/reset-password/${token}`);
  }
}

/**
 * REGISTER (with profile-specific validation)
 */
exports.register = async (req, res) => {
  try {
    const { profile, guest, bank } = req.body;

    // validation logic
    // if (profile === 'guest') {
    //   if (!guest?.aadhaarNumber) {
    //     return badRequest(res, 'Guest users must provide Aadhaar number');
    //   }
    // }
    // if (['hostel_owner', 'tiffin_provider'].includes(profile)) {
    //   if (!bank?.accountNumber || !bank?.ifsc) {
    //     return badRequest(res, 'Bank details are required for Hostel Owner / Tiffin Provider');
    //   }
    // }

    const user = await AuthService.registerLocal(req.body);
    const token = getTokenForUser(user);
    return created(res, { data: { user, token } });
  } catch (err) {
    return serverError(res, err.message);
  }
};

/**
 * LOGIN
 */
exports.login = async (req, res) => {
  try {
    const user = await AuthService.loginLocal(req.body);
    const token = getTokenForUser(user);
    return ok(res, { data: { user, token } });
  } catch (err) {
    return badRequest(res, err.message);
  }
};

/**
 * GOOGLE LOGIN
 */
exports.google = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return badRequest(res, 'idToken required');
    const user = await AuthService.googleLogin(idToken);
    const token = getTokenForUser(user);
    return ok(res, { data: { user, token } });
  } catch (err) {
    return serverError(res, err.message);
  }
};

/**
 * GUEST LOGIN
 */
exports.guest = async (req, res) => {
  try {
    const user = await AuthService.guestLogin();
    const token = getTokenForUser(user);
    return ok(res, { data: { user, token } });
  } catch (err) {
    return serverError(res, err.message);
  }
};

/**
 * FORGOT PASSWORD
 */
exports.forgot = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return badRequest(res, 'email required');
    const { user, token } = await AuthService.requestPasswordReset(email);
    await sendResetEmail(email, token);
    return ok(res, { message: 'Password reset link sent' });
  } catch (err) {
    return serverError(res, err.message);
  }
};

/**
 * RESET PASSWORD
 */
exports.reset = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    if (!newPassword) return badRequest(res, 'newPassword required');
    const user = await AuthService.resetPassword(token, newPassword);
    const jwtToken = getTokenForUser(user);
    return ok(res, { data: { user, token: jwtToken }, message: 'Password reset success' });
  } catch (err) {
    return serverError(res, err.message);
  }
};
