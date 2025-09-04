const Post = require('../models/post.model');

function listPosts() {
  return Post.find().populate('author', 'name email').sort({ createdAt: -1 });
}

function createPost(payload) {
  return Post.create(payload);
}

function getPostById(id) {
  return Post.findById(id).populate('author', 'name email');
}

function updatePost(id, payload) {
  return Post.findByIdAndUpdate(id, payload, { new: true });
}

function deletePost(id) {
  return Post.findByIdAndDelete(id);
}

module.exports = {
  listPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost
};
