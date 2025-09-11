const service = require("../services/tiffin.service");
const { ok, created, serverError, badRequest, notFound } = require('../utils/response');

// exports.saveDraft = async (req, res) => {
//   try {
//     // const userId = req.user && (req.user.id || req.user._id);
//     // if (!userId) return badRequest(res, "Authentication required");

//     const draft = await service.saveDraft(userId, req.body);
//     return created(res, { data: draft, message: "Draft saved" });
//   } catch (err) {
//     return serverError(res, err.message);
//   }
// };
exports.saveDraft = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id); // will be undefined if no auth
    const draft = await service.saveDraft(userId, req.body);
    return created(res, { data: draft, message: "Draft saved" });
  } catch (err) {
    return serverError(res, err.message);
  }
};

exports.updateDraft = async (req, res) => {
  try {
    const draft = await service.updateDraft(req.params.draftId, req.user && req.user.id, req.body);
    if (!draft) return notFound(res, "Draft not found or cannot be updated");
    return ok(res, { data: draft, message: "Draft updated" });
  } catch (err) {
    return serverError(res, err.message);
  }
};

exports.uploadPhotos = async (req, res) => {
  try {
    if (!req.files || !req.files.length) return badRequest(res, "No files uploaded");

    // map to public-accessible paths (adjust folder if you store elsewhere)
    const photoUrls = req.files.map((f) => `/uploads/hostels/${f.filename}`);

    const draft = await service.addPhotos(req.params.draftId, req.user && req.user.id, photoUrls);
    if (!draft) return notFound(res, "Draft not found or photos cannot be added");
    return ok(res, { data: draft, message: "Photos uploaded" });
  } catch (err) {
    return serverError(res, err.message);
  }
};

exports.previewDraft = async (req, res) => {
  try {
    const draft = await service.previewDraft(req.params.draftId, req.user && req.user.id);
    if (!draft) return notFound(res, "Draft not found or access denied");
    return ok(res, { data: draft, message: "Draft preview" });
  } catch (err) {
    return serverError(res, err.message);
  }
};

exports.submitDraft = async (req, res) => {
  try {
    const draft = await service.submitDraft(req.params.draftId, req.user && req.user.id);
    if (!draft) return notFound(res, "Draft not found or cannot be submitted");
    return ok(res, { data: draft, message: "Draft submitted" });
  } catch (err) {
    return serverError(res, err.message);
  }
};

exports.getTiffin = async (req, res) => {
  try {
    const tiffin = await service.getTiffin(req.params.id, req.user && req.user.id);
    if (!tiffin) return notFound(res, "Tiffin not found or access denied");
    return ok(res, { data: tiffin, message: "Tiffin fetched" });
  } catch (err) {
    return serverError(res, err.message);
  }
};