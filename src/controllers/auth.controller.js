const AuthService = require('../services/auth.service');
const { signToken } = require('../utils/jwt');
const { ok, created, badRequest, serverError } = require('../utils/response');
const User = require("../models/User/user.model");

const nodemailer = require("nodemailer");
const crypto = require("crypto");

// in-memory store for OTPs (you can replace with Redis later)
const otpStore = new Map();

function getTokenForUser(user) {
  return signToken({
    id: user._id,
    email: user.email,
    profile: user.profile,
    provider: user.provider
  });
}

// ✅ Nodemailer transporter (use Gmail SMTP + App Password)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// ---------------- AUTH ----------------

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

// ---------------- FORGOT / RESET ----------------

// Send OTP to email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return badRequest(res, "Email is required");

    const user = await User.findOne({ email });
    if (!user) return badRequest(res, "User not found");

    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit
    otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 }); // 5 min expiry

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 5 minutes.`,
      html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; color: #333;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #4CAF50, #2E7D32); color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">🔐 Password Reset OTP</h2>
      </div>
      <div style="padding: 30px; text-align: center;">
        <p style="font-size: 16px;">Hello <b>User</b>,</p>
        <p style="font-size: 16px;">We received a request to reset your password. Use the OTP below to proceed:</p>
        <h1 style="font-size: 36px; color: #4CAF50; letter-spacing: 6px; margin: 20px 0;">${otp}</h1>
        <p style="font-size: 14px; color: #777;">⚠️ This OTP will expire in <b>5 minutes</b>. Please do not share it with anyone.</p>
        <a href="${process.env.BASE_URL}/reset-password" 
           style="display:inline-block; margin-top:20px; padding:12px 24px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px; font-size:16px;">
           Reset Password
        </a>
      </div>
      <div style="background:#f1f1f1; padding: 15px; text-align:center; font-size:12px; color:#777;">
        © ${new Date().getFullYear()} Tifstay. All rights reserved.
      </div>
    </div>
  </div>
`

    });

    return ok(res, { message: "OTP sent to email" });
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Verify OTP
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

// Reset password
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

    user.password = newPassword; // pre-save hook in model will hash this
    await user.save();

    otpStore.delete(email);
    return ok(res, { message: "Password reset successful" });
  } catch (err) {
    return serverError(res, err.message);
  }
};
