// src/services/auth.service.js
const User = require('../models/user.model');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Local registration
async function registerLocal({ name, email, password, phone, profile, guest, bank, address }) {
  // basic required fields check
  if (!name || !email || !password) {
    throw new Error('name, email and password are required');
  }

  // check duplicate email
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error('Email already registered');
  }

  // create user (password hashing should be handled in User model pre-save)
  const user = new User({
    name,
    email,
    password,
    phone: phone || null,
    provider: 'local',
    profile: profile || 'guest',
    guest: guest || undefined,
    bank: bank || undefined,
    address: address || undefined
  });

  await user.save();
  return user;
}

// Local login
async function loginLocal({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  if (!user.password) throw new Error('Account not setup for local login');
  const ok = await user.comparePassword(password);
  if (!ok) throw new Error('Invalid credentials');
  return user;
}

// Google login
async function googleLogin(idToken) {
  const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  const email = payload.email;
  let user = await User.findOne({ email });

  if (!user) {
    user = new User({
      name: payload.name || email.split('@')[0],
      email,
      provider: 'google',
      avatar: payload.picture
    });
    await user.save();
  } else {
    if (user.provider !== 'google') {
      user.provider = 'google';
      await user.save();
    }
  }
  return user;
}

// Guest login
async function guestLogin() {
  const guestEmail = `guest_${Date.now()}@example.com`;
  const user = new User({
    name: 'Guest User',
    email: guestEmail,
    provider: 'guest'
  });
  await user.save();
  return user;
}

// Request password reset
async function requestPasswordReset(email) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('No account with that email');
  const token = user.generatePasswordReset(); // plain token
  await user.save();
  return { user, token };
}

// Reset password
async function resetPassword(tokenPlain, newPassword) {
  const hashed = crypto.createHash('sha256').update(tokenPlain).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) throw new Error('Invalid or expired token');
  user.password = newPassword;
  user.clearPasswordReset();
  await user.save();
  return user;
}

// Change password
async function changePassword(userId, oldPassword, newPassword) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  const ok = await user.comparePassword(oldPassword);
  if (!ok) throw new Error('Old password incorrect');
  user.password = newPassword;
  await user.save();
  return user;
}

// Update profile
async function updateProfile(userId, payload) {
  const allowed = ['name','phone','avatar','bank'];
  const update = {};
  for (const k of allowed) if (k in payload) update[k] = payload[k];
  return User.findByIdAndUpdate(userId, update, { new: true });
}

module.exports = {
  registerLocal,
  loginLocal,
  googleLogin,
  guestLogin,
  requestPasswordReset,
  resetPassword,
  changePassword,
  updateProfile
};
