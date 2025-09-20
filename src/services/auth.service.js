const User = require('../models/user.model');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Local Register
async function registerLocal({ name, email, password, profile, bank, address, guest }) {
  if (!name || !email || !password) throw new Error('name, email and password required');

  const exists = await User.findOne({ email });
  if (exists) throw new Error('Email already registered');

  const user = new User({
    name,
    email,
    password,
    profile: profile || 'guest',
    bank: bank || undefined,
    address: address || undefined,
    guest: guest || undefined,
    provider: 'local'
  });

  await user.save();
  return user;
}

// Local Login
async function loginLocal({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  if (!user.password) throw new Error('Account not setup for local login');

  const ok = await user.comparePassword(password);
  if (!ok) throw new Error('Invalid credentials');
  return user;
}

// Google Login
async function googleLogin(idToken) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  const email = payload.email;

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({
      name: payload.name || email.split('@')[0],
      email,
      provider: 'google',
      avatar: payload.picture,
      profile: 'guest'
    });
    await user.save();
  }
  return user;
}

// Apple Login (basic decode — production me Apple public key se verify karo)
async function appleLogin(idToken) {
  const decoded = jwt.decode(idToken, { complete: true });
  if (!decoded) throw new Error('Invalid Apple token');

  const email = decoded.payload.email;
  if (!email) throw new Error('Apple token missing email');

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({
      name: email.split('@')[0],
      email,
      provider: 'apple',
      profile: 'guest'
    });
    await user.save();
  }
  return user;
}

module.exports = {
  registerLocal,
  loginLocal,
  googleLogin,
  appleLogin
};
