// src/services/auth.service.js
const User = require('../models/user.model');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function registerLocal({ name, email, password, phone }) {
  const exists = await User.findOne({ email });
  if (exists) throw new Error('Email already registered');
  const user = new User({ name, email, password, phone, provider: 'local' });
  await user.save();
  return user;
}

async function loginLocal({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  if (!user.password) throw new Error('Account not setup for local login');
  const ok = await user.comparePassword(password);
  if (!ok) throw new Error('Invalid credentials');
  return user;
}

async function googleLogin(idToken) {
  const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  const email = payload.email;
  let user = await User.findOne({ email });
  if (!user) {
    // create user
    user = new User({
      name: payload.name || email.split('@')[0],
      email,
      provider: 'google',
      avatar: payload.picture
    });
    await user.save();
  } else {
    // ensure provider stored
    if (user.provider !== 'google') user.provider = 'google', await user.save();
  }
  return user;
}

async function requestPasswordReset(email) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('No account with that email');
  const token = user.generatePasswordReset(); // plain token
  await user.save();
  return { user, token };
}

async function resetPassword(tokenPlain, newPassword) {
  const crypto = require('crypto');
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

async function changePassword(userId, oldPassword, newPassword) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  const ok = await user.comparePassword(oldPassword);
  if (!ok) throw new Error('Old password incorrect');
  user.password = newPassword;
  await user.save();
  return user;
}

async function updateProfile(userId, payload) {
  const allowed = ['name','phone','avatar','bank']; // fields allowed
  const update = {};
  for (const k of allowed) if (k in payload) update[k] = payload[k];
  const user = await User.findByIdAndUpdate(userId, update, { new: true });
  return user;
}

module.exports = {
  registerLocal, loginLocal, googleLogin,
  requestPasswordReset, resetPassword,
  changePassword, updateProfile
};
