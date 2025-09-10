// src/services/user.service.js
const User = require('../models/user.model');

async function createUser(payload) {
  const exists = await User.findOne({ email: payload.email });
  if (exists) throw new Error('Email already in use');
  const user = new User(payload);
  return user.save();
}

async function getUsers() {
  return User.find().sort({ createdAt: -1 });
}

async function getUserById(id) {
  return User.findById(id);
}

async function updateUser(id, payload) {
  return User.findByIdAndUpdate(id, payload, { new: true });
}

async function deleteUser(id) {
  return User.findByIdAndDelete(id);
}

async function authenticate(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const ok = await user.comparePassword(password);
  if (!ok) throw new Error('Invalid credentials');
  return user;
}

async function getUsersByProfile(profile) {
  const allowed = ['student', 'guest', 'hostel_owner', 'tiffin_provider'];
  if (!allowed.includes(profile)) throw new Error('Invalid profile');
  return User.find({ profile }).sort({ createdAt: -1 });
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  authenticate,
  getUsersByProfile
};
