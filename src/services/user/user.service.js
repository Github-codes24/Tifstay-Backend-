const User = require('../../models/User/user.model');

async function createUser(payload) {
  const exists = await User.findOne({ email: payload.email });
  if (exists) throw new Error('Email already exists');
  const user = new User(payload);
  return await user.save();
}

async function getUserById(id) {
  return User.findById(id).select('-password -resetPasswordToken -resetPasswordExpires');
}

async function updateUser(id, payload) {
  return User.findByIdAndUpdate(id, payload, { new: true }).select('-password');
}

async function getUsersByProfile(profile) {
  return User.find({ profile }).select('-password');
}

module.exports = { createUser, getUserById, updateUser, getUsersByProfile };
