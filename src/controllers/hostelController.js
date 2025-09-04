// controllers/hostelController.js
const Hostel = require("../models/hostel.model");
const { ok, created, notFound, serverError } = require("../utils/response");

// Create new hostel
exports.createHostel = async (req, res) => {
  try {
    const photos = req.files.map((file) => file.path); // save file paths

    const hostel = new Hostel({
      ...req.body,
      photos,
      user: req.user._id, // from auth middleware
    });

    await hostel.save();
    return created(res, hostel);
  } catch (error) {
    return serverError(res, error.message);
  }
};

// Get all hostels
exports.getHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find().populate("user");
    return ok(res, hostels);
  } catch (error) {
    return serverError(res, error.message);
  }
};

// Get hostel by ID
exports.getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate("user");
    if (!hostel) return notFound(res, "Hostel not found");
    return ok(res, hostel);
  } catch (error) {
    return serverError(res, error.message);
  }
};
