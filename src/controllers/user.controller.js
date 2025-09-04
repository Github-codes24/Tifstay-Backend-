// src/controllers/user.controller.js
const AuthService = require('../services/auth.service');
const { ok, serverError, badRequest } = require('../utils/response');

exports.getProfile = async (req, res) => {
  try {
    // req.user set by auth middleware
    const userId = req.user.id;
    const User = require('../models/user.model');
    const user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires');
    return ok(res, { data: user });
  } catch (err) { return serverError(res, err.message); }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await AuthService.updateProfile(req.user.id, req.body);
    return ok(res, { data: user, message: 'Profile updated' });
  } catch (err) { return serverError(res, err.message); }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return badRequest(res, 'oldPassword and newPassword required');
    const user = await AuthService.changePassword(req.user.id, oldPassword, newPassword);
    return ok(res, { data: user, message: 'Password changed' });
  } catch (err) { return serverError(res, err.message); }
};
