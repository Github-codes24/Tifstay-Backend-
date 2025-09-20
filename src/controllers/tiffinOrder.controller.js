const service = require('../services/tiffinOrder.service');

exports.create = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return res.status(401).json({ status:401, success:false, message:'Auth required' });

    const payload = { ...req.body, user: userId };
    const order = await service.createOrder(payload);
    return res.status(201).json({ status:201, success:true, data: order });
  } catch (err) {
    return res.status(500).json({ status:500, success:false, message: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    const isAdmin = req.user && req.user.role === 'admin';
    const order = await service.getById(req.params.id, userId, isAdmin);
    if (!order) return res.status(404).json({ status:404, success:false, message:'Order not found' });
    return res.json({ status:200, success:true, data: order });
  } catch (err) {
    return res.status(500).json({ status:500, success:false, message: err.message });
  }
};

exports.myOrders = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return res.status(401).json({ status:401, success:false, message:'Auth required' });
    const orders = await service.getUserOrders(userId, req.query.limit);
    return res.json({ status:200, success:true, data: orders });
  } catch (err) {
    return res.status(500).json({ status:500, success:false, message: err.message });
  }
};

exports.adminList = async (req, res) => {
  try {
    // require admin in route
    const filter = req.query || {};
    const list = await service.adminList(filter, req.query.limit);
    return res.json({ status:200, success:true, data: list });
  } catch (err) {
    return res.status(500).json({ status:500, success:false, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const updated = await service.updateStatus(req.params.id, req.body.status);
    if (!updated) return res.status(404).json({ status:404, success:false, message:'Order not found' });
    return res.json({ status:200, success:true, data: updated });
  } catch (err) {
    return res.status(500).json({ status:500, success:false, message: err.message });
  }
};