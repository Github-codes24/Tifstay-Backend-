const Tiffin = require("../models/tiffin.model");

exports.saveDraft = async (userId, data) => {
  try {
    const payload = { ...data, status: "draft" };
    if (userId) payload.user = userId;
    const draft = new Tiffin(payload);
    const saved = await draft.save();
    console.log('tiffin saved id=', saved._id);
    return saved;
  } catch (err) {
    console.error('saveDraft error ->', err);
    throw err;
  }
};

// Update draft (only draft status). If userId provided enforce owner, else allow.
exports.updateDraft = async (draftId, userId, data) => {
  const filter = { _id: draftId, status: "draft" };
  if (userId) filter.user = userId;
  return await Tiffin.findOneAndUpdate(filter, { $set: data }, { new: true });
};

// Upload photos (only to draft)
exports.addPhotos = async (draftId, userId, photoUrls) => {
  const filter = { _id: draftId, status: "draft" };
  if (userId) filter.user = userId;
  return await Tiffin.findOneAndUpdate(filter, { $push: { photos: { $each: photoUrls } } }, { new: true });
};

// Preview draft (owner only if userId provided)
exports.previewDraft = async (draftId, userId) => {
  const filter = { _id: draftId };
  if (userId) filter.$or = [{ user: userId }, { status: { $ne: "draft" } }]; // owner can preview draft, others can view if not draft
  return await Tiffin.findOne(filter);
};

// Submit final draft (draft -> submitted)
exports.submitDraft = async (draftId, userId) => {
  const filter = { _id: draftId, status: "draft" };
  if (userId) filter.user = userId;
  return await Tiffin.findOneAndUpdate(filter, { $set: { status: "submitted", submittedAt: new Date() } }, { new: true });
};

// Get single tiffin: published OR owner
exports.getTiffin = async (id, userId) => {
  if (userId) {
    return await Tiffin.findOne({ _id: id, $or: [{ status: "published" }, { user: userId }] });
  }
  return await Tiffin.findOne({ _id: id, status: "published" });
};