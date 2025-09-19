const service = require("../services/tiffin.admin.service");
const { ok, notFound, serverError } = require("../utils/response");

// Get all with pagination + status filter
exports.getAllTiffins = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const result = await service.getAllTiffins(page, limit, status, search);
    return ok(res, { data: result.data, total: result.total, page, limit });
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Get single tiffin
exports.getTiffinById = async (req, res) => {
  try {
    const tiffin = await service.getTiffinById(req.params.id);
    if (!tiffin) return notFound(res, "Tiffin not found");
    return ok(res, { data: tiffin });
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Approve
exports.approveTiffin = async (req, res) => {
  try {
    const updated = await service.updateStatus(req.params.id, "published");
    if (!updated) return notFound(res, "Tiffin not found");
    return ok(res, { data: updated, message: "Tiffin approved" });
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Reject
exports.rejectTiffin = async (req, res) => {
  try {
    const updated = await service.updateStatus(req.params.id, "rejected");
    if (!updated) return notFound(res, "Tiffin not found");
    return ok(res, { data: updated, message: "Tiffin rejected" });
  } catch (err) {
    return serverError(res, err.message);
  }
};
