const postService = require('../services/post.service');
const { ok, created } = require('../utils/response');

exports.create = async (req, res) => {
  const post = await postService.createPost({ ...req.body, author: req.user.id });
  return created(res, { post });
};

exports.list = async (_req, res) => {
  const posts = await postService.listPosts();
  return ok(res, { posts });
};

exports.getOne = async (req, res) => {
  const post = await postService.getPostById(req.params.id);
  return ok(res, { post });
};

exports.update = async (req, res) => {
  const post = await postService.updatePost(req.params.id, req.body);
  return ok(res, { post });
};

exports.remove = async (req, res) => {
  await postService.deletePost(req.params.id);
  return ok(res, { deleted: true });
};
