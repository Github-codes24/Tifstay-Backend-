const Hostel = require("../models/hostel.model");

// Get all hostels with pagination + filter
exports.getAllHostels = async (page, limit, status, search) => {
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.name = { $regex: search, $options: "i" };

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Hostel.find(filter).skip(skip).limit(Number(limit)),
    Hostel.countDocuments(filter)
  ]);

  return { data, total };
};

// Get by id
exports.getHostelById = async (id) => {
  return await Hostel.findById(id);
};

// Update status (approve/reject)
exports.updateStatus = async (id, status) => {
  return await Hostel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};
