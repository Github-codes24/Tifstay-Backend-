const TiffinOrder = require('../models/tiffinOrder.model');

async function createOrder(payload) {
  const o = new TiffinOrder(payload);
  return await o.save();
}

async function getById(id, userId, isAdmin=false) {
  const q = { _id: id };
  if (!isAdmin && userId) q.user = userId;
  return await TiffinOrder.findOne(q).populate('user provider tiffin').lean();
}

async function getUserOrders(userId, limit=50) {
  return await TiffinOrder.find({ user: userId }).sort({ createdAt: -1 }).limit(Number(limit)).populate('tiffin provider').lean();
}

async function adminList(filter={}, limit=100) {
  return await TiffinOrder.find(filter).sort({ createdAt: -1 }).limit(Number(limit)).populate('user provider tiffin').lean();
}

async function updateStatus(id, status) {
  return await TiffinOrder.findByIdAndUpdate(id, { $set: { status } }, { new: true });
}

module.exports = { createOrder, getById, getUserOrders, adminList, updateStatus };