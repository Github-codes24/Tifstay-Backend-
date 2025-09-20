const UserService = require('../../services/user/user.service');
const { ok, badRequest, notFound, created, serverError } = require('../../utils/response');

// Register role-specific
exports.register = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    return created(res, { data: user, message: "User registered" });
  } catch (err) {
    return badRequest(res, err.message);
  }
};

// Get my profile
exports.getProfile = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.user.id);
    if (!user) return notFound(res, "User not found");
    return ok(res, { data: user });
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await UserService.updateUser(req.user.id, req.body);
    return ok(res, { data: user, message: "Profile updated" });
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Admin: get users by role
exports.getUsersByRole = async (req, res) => {
  try {
    const users = await UserService.getUsersByProfile(req.params.role);
    return ok(res, { data: users });
  } catch (err) {
    return serverError(res, err.message);
  }
};
