const userService = require('../services/user.service');
const { signToken } = require('../utils/jwt');
const { ok, created } = require('../utils/response');

exports.register = async (req, res) => {
  const user = await userService.createUser(req.body);
  return created(res, { user });
};

exports.login = async (req, res) => {
  const user = await userService.authenticate(req.body.email, req.body.password);
  const token = signToken({ id: user.id, role: user.role });
  return ok(res, { token, user });
};

exports.me = async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  return ok(res, { user });
};

exports.list = async (_req, res) => {
  const users = await userService.getUsers();
  return ok(res, { users });
};
