const AuthService = require('../services/auth.service');
const UserService = require('../services/user.service');
const path = require('path');
const { ok, serverError, badRequest, notFound, created } = require('../utils/response');
const User = require('../models/user.model');

/**
 * GET PROFILE
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) return notFound(res, 'User not found');
    return ok(res, { data: user });
  } catch (err) {
    return serverError(res, err.message);
  }
};

/**
 * UPDATE PROFILE (with profile-specific validation)
 */
exports.updateProfile = async (req, res) => {
  try {
    const { profile, guest, bank } = req.body;

    // validation logic
    if (profile === 'guest') {
      if (!guest?.aadhaarNumber) {
        return badRequest(res, 'Guest users must have Aadhaar details');
      }
    }
    if (['hostel_owner', 'tiffin_provider'].includes(profile)) {
      if (!bank?.accountNumber || !bank?.ifsc) {
        return badRequest(res, 'Bank details required for Hostel Owner / Tiffin Provider');
      }
    }

    const user = await AuthService.updateProfile(req.user.id, req.body);
    return ok(res, { data: user, message: 'Profile updated' });
  } catch (err) {
    return serverError(res, err.message);
  }
};

/**
 * CHANGE PASSWORD
 */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return badRequest(res, 'oldPassword and newPassword required');
    const user = await AuthService.changePassword(req.user.id, oldPassword, newPassword);
    return ok(res, { data: user, message: 'Password changed' });
  } catch (err) {
    return serverError(res, err.message);
  }
};

/**
 * ADMIN: GET ALL USERS
 */
exports.getUsers = async (_req, res) => {
  try {
    const users = await User.find()
      .select('-password -resetPasswordToken -resetPasswordExpires');
    return ok(res, { data: users });
  } catch (err) {
    return serverError(res, err.message);
  }
};

/**
 * ADMIN: GET USER BY ID
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) return notFound(res, 'User not found');
    return ok(res, { data: user });
  } catch (err) {
    return serverError(res, err.message);
  }
};

/**
 * ADMIN: UPDATE USER
 */
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) return notFound(res, 'User not found');
    return ok(res, { data: user, message: 'User updated successfully' });
  } catch (err) {
    return serverError(res, err.message);
  }
};

/**
 * ADMIN: DELETE USER
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return notFound(res, 'User not found');
    return ok(res, { message: 'User deleted successfully' });
  } catch (err) {
    return serverError(res, err.message);
  }
};

// ADMIN: CREATE USER
exports.createUser = async (req, res) => {
  try {
    const payload = req.body;
    // minimal validation
    if (!payload.name || !payload.email) return badRequest(res, 'name and email are required');

    const user = await UserService.createUser(payload);
    return created(res, { data: user, message: 'User created' });
  } catch (err) {
    // maintain friendly messages for duplicate email
    if (err.message && err.message.toLowerCase().includes('email')) return badRequest(res, err.message);
    return serverError(res, err.message);
  }
};

exports.uploadProfile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ status: 400, success: false, message: 'No file uploaded' });
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return res.status(401).json({ status: 401, success: false, message: 'Authentication required' });

    const rel = path.join('uploads', 'profiles', req.file.filename).replace(/\\/g, '/');
    const url = `${req.protocol}://${req.get('host')}/${rel}`;
    const user = await UserService.updateProfileAvatar(userId, url);
    return res.status(200).json({ status: 200, success: true, message: 'Profile uploaded', data: { avatar: user.avatar } });
  } catch (err) {
    return res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

exports.uploadProfileById = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ status: 400, success: false, message: 'No file uploaded' });
    const userId = req.params.id;
    const rel = path.join('uploads', 'profiles', req.file.filename).replace(/\\/g, '/');
    const url = `${req.protocol}://${req.get('host')}/${rel}`;
    const user = await UserService.updateProfileAvatar(userId, url);
    if (!user) return res.status(404).json({ status: 404, success: false, message: 'User not found' });
    return res.status(200).json({ status: 200, success: true, message: 'Profile uploaded for user', data: { avatar: user.avatar } });
  } catch (err) {
    return res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

exports.getHostelOwners = async (req, res) => {
  try {
    const q = req.query.q;
    const limit = req.query.limit;
    const users = await UserService.getUsersByProfile('hostel_owner', { q, limit });
    return res.status(200).json({ status: 200, success: true, data: users, message: 'Hostel owners fetched' });
  } catch (err) {
    return res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

exports.getGuests = async (req, res) => {
  try {
    const q = req.query.q;
    const limit = req.query.limit;
    const users = await UserService.getUsersByProfile('guest', { q, limit });
    return res.status(200).json({ status: 200, success: true, data: users, message: 'Guests fetched' });
  } catch (err) {
    return res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

exports.getTiffinProviders = async (req, res) => {
  try {
    const q = req.query.q;
    const limit = req.query.limit;
    const users = await UserService.getUsersByProfile('tiffin_provider', { q, limit });
    return res.status(200).json({ status: 200, success: true, data: users, message: 'Tiffin providers fetched' });
  } catch (err) {
    return res.status(500).json({ status: 500, success: false, message: err.message });
  }
};
