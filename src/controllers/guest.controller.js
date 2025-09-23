const Tiffin = require("../models/tiffin.model");
const Hostel = require("../models/hostel.model");
const { ok, serverError } = require("../utils/response");

// Tiffin filter
exports.getTiffins = async (req, res) => {
  try {
    const { search, rating, cost, foodType } = req.query;
    let query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (foodType) query.foodType = foodType;

    // Example: filtering by min rating (if you store reviews in model)
    if (rating) query.avgRating = { $gte: parseFloat(rating) };

    let tiffins = Tiffin.find(query);

    if (cost === "low") tiffins = tiffins.sort({ "pricing.price": 1 });
    if (cost === "high") tiffins = tiffins.sort({ "pricing.price": -1 });

    const results = await tiffins.exec();
    return ok(res, { data: results, message: "Tiffins fetched" });
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Hostel filter
exports.getHostels = async (req, res) => {
  try {
    const { search, hostelType, cost } = req.query;
    let query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (hostelType) query.hostelType = hostelType;

    let hostels = Hostel.find(query);

    if (cost === "low") hostels = hostels.sort({ "pricing.price": 1 });
    if (cost === "high") hostels = hostels.sort({ "pricing.price": -1 });

    const results = await hostels.exec();
    return ok(res, { data: results, message: "Hostels fetched" });
  } catch (err) {
    return serverError(res, err.message);
  }
};
