const AuthService = require('../services/auth.service');
const { signToken } = require('../utils/jwt');
const { ok, created, badRequest, serverError } = require('../utils/response');
const User = require("../models/User/user.model");

const nodemailer = require("nodemailer");
const crypto = require("crypto");
const otpStore = new Map();
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

/**
 * Send OTP to email
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return badRequest(res, "Email is required");

    const user = await User.findOne({ email });
    if (!user) return badRequest(res, "User not found");

    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit
    otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 }); // 5 min expiry

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. Valid for 5 minutes.`,
    });

    return ok(res, { message: "OTP sent to email" });
  } catch (err) {
    return serverError(res, err.message);
  }
};

/**
 * Verify OTP
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return badRequest(res, "Email and OTP required");

    const record = otpStore.get(email);
    if (!record) return badRequest(res, "OTP not found");
    if (record.otp !== otp) return badRequest(res, "Invalid OTP");
    if (Date.now() > record.expires) return badRequest(res, "OTP expired");

    return ok(res, { message: "OTP verified" });
  } catch (err) {
    return serverError(res, err.message);
  }
};

/**
 * Reset password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return badRequest(res, "All fields required");

    const record = otpStore.get(email);
    if (!record) return badRequest(res, "OTP not found");
    if (record.otp !== otp) return badRequest(res, "Invalid OTP");
    if (Date.now() > record.expires) return badRequest(res, "OTP expired");

    const user = await User.findOne({ email });
    if (!user) return badRequest(res, "User not found");

    user.password = newPassword; // auto-hash from model
    await user.save();

    otpStore.delete(email);
    return ok(res, { message: "Password reset successful" });
  } catch (err) {
    return serverError(res, err.message);
  }
};