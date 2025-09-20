const HostelOrder = require('../models/hostelOrder.model');

async function createOrder(payload) {
  const o = new HostelOrder(payload);
  return await o.save();
}

async function getById(id, userId, isAdmin=false) {
  const q = { _id: id };
  if (!isAdmin && userId) q.user = userId;
  return await HostelOrder.findOne(q).populate('user hostel room').lean();
}

async function getUserOrders(userId, limit=50) {
  return await HostelOrder.find({ user: userId }).sort({ createdAt: -1 }).limit(Number(limit)).populate('hostel room').lean();
}

async function adminList(filter={}, limit=100) {
  return await HostelOrder.find(filter).sort({ createdAt: -1 }).limit(Number(limit)).populate('user hostel room').lean();
}

async function updateStatus(id, status) {
  return await HostelOrder.findByIdAndUpdate(id, { $set: { status } }, { new: true });
}

module.exports = { createOrder, getById, getUserOrders, adminList, updateStatus };