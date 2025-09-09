const Tiffin = require("../models/tiffin.model");

// Save draft
exports.saveDraft = async (userId, data) => {
  const draft = new Tiffin({ userId, ...data, status: "draft" });
  return await draft.save();
};

// Update draft step (only if still a draft and owned by user)
exports.updateDraft = async (draftId, userId, data) => {
  return await Tiffin.findOneAndUpdate(
    { _id: draftId, userId, status: "draft" },
    { $set: data },
    { new: true }
  );
};

// Upload photos (only to draft)
exports.addPhotos = async (draftId, userId, photoUrls) => {
  return await Tiffin.findOneAndUpdate(
    { _id: draftId, userId, status: "draft" },
    { $push: { photos: { $each: photoUrls } } },
    { new: true }
  );
};

// Preview draft (owner only)
exports.previewDraft = async (draftId, userId) => {
  return await Tiffin.findOne({ _id: draftId, userId });
};

// Submit final draft (only from draft -> submitted)
exports.submitDraft = async (draftId, userId) => {
  return await Tiffin.findOneAndUpdate(
    { _id: draftId, userId, status: "draft" },
    { $set: { status: "submitted", submittedAt: new Date() } },
    { new: true }
  );
};

// Get single tiffin: allow if published OR owner
exports.getTiffin = async (id, userId) => {
  const orConditions = [{ status: "published" }];
  if (userId) orConditions.push({ userId });
  return await Tiffin.findOne({ _id: id, $or: orConditions });
};
