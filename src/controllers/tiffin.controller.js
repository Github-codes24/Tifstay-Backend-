const service = require("../services/tiffin.service");
const { ok, created, serverError, badRequest } = require('../utils/response');

/**
 * Create draft
 */
exports.saveDraft = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id); // will be undefined if no auth
    const draft = await service.saveDraft(userId, req.body);
    return created ? created(res, { data: draft, message: "Draft saved" }) : res.status(201).json({ status: 201, success: true, data: draft, message: "Draft saved" });
  } catch (err) {
    return serverError ? serverError(res, err.message) : res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

/**
 * Update draft
 */
exports.updateDraft = async (req, res) => {
  try {
    const draft = await service.updateDraft(req.params.draftId, req.user && (req.user.id || req.user._id), req.body);
    if (!draft) return res.status(404).json({ status: 404, success: false, message: "Draft not found or cannot be updated" });
    return ok ? ok(res, { data: draft, message: "Draft updated" }) : res.json({ status: 200, success: true, data: draft, message: "Draft updated" });
  } catch (err) {
    return serverError ? serverError(res, err.message) : res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

/**
 * Upload photos
 */
exports.uploadPhotos = async (req, res) => {
  try {
    if (!req.files || !req.files.length) return res.status(400).json({ status: 400, success: false, message: "No files uploaded" });

    const host = req.get('host');
    const protocol = req.protocol;
    const photoUrls = req.files.map(f => {
      const rel = f.path.replace(process.cwd(), "").replace(/^[\\\/]+/, "").replace(/\\/g, "/");
      return `${protocol}://${host}/${rel}`;
    });

    const draft = await service.addPhotos(req.params.draftId, req.user && (req.user.id || req.user._id), photoUrls);
    if (!draft) return res.status(404).json({ status: 404, success: false, message: "Draft not found or photos cannot be added" });
    return ok ? ok(res, { data: draft, message: "Photos uploaded" }) : res.json({ status: 200, success: true, data: draft, message: "Photos uploaded" });
  } catch (err) {
    return serverError ? serverError(res, err.message) : res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

/**
 * Preview draft
 */
exports.previewDraft = async (req, res) => {
  try {
    const draft = await service.previewDraft(req.params.draftId, req.user && (req.user.id || req.user._id));
    if (!draft) return res.status(404).json({ status: 404, success: false, message: "Draft not found or access denied" });
    return ok ? ok(res, { data: draft, message: "Draft preview" }) : res.json({ status: 200, success: true, data: draft, message: "Draft preview" });
  } catch (err) {
    return serverError ? serverError(res, err.message) : res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

/**
 * Submit draft
 */
exports.submitDraft = async (req, res) => {
  try {
    const draft = await service.submitDraft(req.params.draftId, req.user && (req.user.id || req.user._id));
    if (!draft) return res.status(404).json({ status: 404, success: false, message: "Draft not found or cannot be submitted" });
    return ok ? ok(res, { data: draft, message: "Draft submitted" }) : res.json({ status: 200, success: true, data: draft, message: "Draft submitted" });
  } catch (err) {
    return serverError ? serverError(res, err.message) : res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

/**
 * Get tiffin by id
 */
exports.getTiffin = async (req, res) => {
  try {
    const tiffin = await service.getTiffin(req.params.id, req.user && (req.user.id || req.user._id));
    if (!tiffin) return res.status(404).json({ status: 404, success: false, message: "Tiffin not found" });
    return ok ? ok(res, { data: tiffin, message: "Tiffin fetched" }) : res.json({ status: 200, success: true, data: tiffin, message: "Tiffin fetched" });
  } catch (err) {
    return serverError ? serverError(res, err.message) : res.status(500).json({ status: 500, success: false, message: err.message });
  }
};