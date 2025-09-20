const service = require("../services/hostel.admin.service");
const { ok, notFound, serverError } = require("../utils/response");

// Get all with pagination + status filter
exports.getAllHostels = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const result = await service.getAllHostels(page, limit, status, search);
    return ok(res, { data: result.data, total: result.total, page, limit });
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Get single hostel
exports.getHostelById = async (req, res) => {
  try {
    const hostel = await service.getHostelById(req.params.id);
    if (!hostel) return notFound(res, "Hostel not found");
    return ok(res, { data: hostel });
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Approve hostel
exports.approveHostel = async (req, res) => {
  try {
    const updated = await service.updateStatus(req.params.id, "published");
    if (!updated) return notFound(res, "Hostel not found");
    return ok(res, { data: updated, message: "Hostel approved" });
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Reject hostel
exports.rejectHostel = async (req, res) => {
  try {
    const updated = await service.updateStatus(req.params.id, "rejected");
    if (!updated) return notFound(res, "Hostel not found");
    return ok(res, { data: updated, message: "Hostel rejected" });
  } catch (err) {
    return serverError(res, err.message);
  }
};
