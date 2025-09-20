// controllers/hostelController.js
const HostelService = require("../services/hostel.service");
const { ok, created, notFound, serverError, badRequest } = require("../utils/response");

// helper: try parse JSON strings or return fallback
function parseMaybeJSON(value, fallback) {
  if (!value) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    // fallback to comma-split for simple lists
    if (typeof value === "string") {
      return value.split(",").map(s => s.trim()).filter(Boolean);
    }
    return fallback;
  }
}

// Create new hostel
exports.createHostel = async (req, res) => {
  try {
    const photos = Array.isArray(req.files) ? req.files.map((file) => {
      // store relative path for serving later (use forward slashes)
      const rel = file.path.replace(process.cwd(), "").replace(/^[\\\/]+/, "");
      return rel.replace(/\\/g, "/");
    }) : [];

    // const userId = (req.user && (req.user.id || req.user._id));
    // if (!userId) return badRequest(res, "Authentication required");
        const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return badRequest(res, "Authentication required");

    // basic validation
    const { name, hostelType } = req.body;
    if (!name || !hostelType) return badRequest(res, "name and hostelType are required");

    // parse possibly-JSON fields sent from mobile/web form as strings
    const pricing = parseMaybeJSON(req.body.pricing, []);
    const rooms = parseMaybeJSON(req.body.rooms, []);
    const facilities = parseMaybeJSON(req.body.facilities, []);
    const rules = parseMaybeJSON(req.body.rules, []);

    const hostelData = {
      // user: userId,
      userId,
      name: req.body.name,
      hostelType: req.body.hostelType,
      description: req.body.description,
      pricing,
      rooms,
      photos,
      facilities,
      rules,
      location: parseMaybeJSON(req.body.location, {}),
      contact: parseMaybeJSON(req.body.contact, {})
    };

    const hostel = await HostelService.createHostel(hostelData);
    return created(res, { data: hostel, message: "Hostel created" });
  } catch (error) {
    return serverError(res, error.message);
  }
};

// Get all hostels
exports.getHostels = async (req, res) => {
  try {
    const hostels = await HostelService.getAllHostels();
    return ok(res, { data: hostels, message: "Hostels fetched" });
  } catch (error) {
    return serverError(res, error.message);
  }
};

// Get hostel by ID
exports.getHostelById = async (req, res) => {
  try {
    const hostel = await HostelService.getHostelById(req.params.id);
    if (!hostel) return notFound(res, "Hostel not found");
    return ok(res, { data: hostel, message: "Hostel fetched" });
  } catch (error) {
    return serverError(res, error.message);
  }
};
// Update hostel by ID
exports.updateHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return badRequest(res, "Authentication required");

    // Prepare update payload (parse JSON strings if present)
    const updateData = {
      ...req.body,
      pricing: req.body.pricing ? parseMaybeJSON(req.body.pricing, []) : undefined,
      rooms: req.body.rooms ? parseMaybeJSON(req.body.rooms, []) : undefined,
      facilities: req.body.facilities ? parseMaybeJSON(req.body.facilities, []) : undefined,
      rules: req.body.rules ? parseMaybeJSON(req.body.rules, []) : undefined,
      location: req.body.location ? parseMaybeJSON(req.body.location, {}) : undefined,
      contact: req.body.contact ? parseMaybeJSON(req.body.contact, {}) : undefined
    };

    // If photos uploaded, map file paths and replace photos array (or append as you prefer)
    if (Array.isArray(req.files) && req.files.length) {
      const photos = req.files.map(file => {
        const rel = file.path.replace(process.cwd(), "").replace(/^[\\\/]+/, "");
        return rel.replace(/\\/g, "/");
      });
      updateData.photos = photos;
    }

    // Remove undefined fields so we don't overwrite existing data with undefined
    const cleanUpdate = Object.fromEntries(
      Object.entries(updateData).filter(([, v]) => v !== undefined)
    );

    const hostel = await HostelService.updateHostel(id, userId, cleanUpdate);
    if (!hostel) return notFound(res, "Hostel not found or not authorized");

    return ok(res, { data: hostel, message: "Hostel updated" });
  } catch (error) {
    return serverError(res, error.message);
  }
};
