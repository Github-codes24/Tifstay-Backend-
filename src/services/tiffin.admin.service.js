const Tiffin = require("../models/tiffin.model");

// Get all tiffins with pagination + filter
exports.getAllTiffins = async (page, limit, status, search) => {
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.name = { $regex: search, $options: "i" };

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Tiffin.find(filter).skip(skip).limit(Number(limit)),
    Tiffin.countDocuments(filter)
  ]);

  return { data, total };
};

// Get by id
exports.getTiffinById = async (id) => {
  return await Tiffin.findById(id);
};

// Update status (approve/reject)
exports.updateStatus = async (id, status) => {
  return await Tiffin.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};
