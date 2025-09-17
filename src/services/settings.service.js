const Settings = require('../models/settings.model');

/**
 * Retrieves the application's settings.
 * If no settings document exists, it creates a default one.
 */
const getSettings = async () => {
    const settings = await Settings.findOneAndUpdate({}, {}, { new: true, upsert: true });
    return settings;
};

/**
 * Updates the Tax & GST specific settings.
 */
const updateTaxAndGst = async (updateData) => {
    const settings = await Settings.findOneAndUpdate(
        {},
        { $set: { 'taxAndGst': updateData } },
        { new: true, upsert: true }
    );
    return settings;
};

/**
 * Updates the Penalty specific settings.
 * @param {object} updateData
 * @returns {Promise<Document>}
 */
const updatePenalty = async (updateData) => {
    const settings = await Settings.findOneAndUpdate(
        {},
        { $set: { 'penalty': updateData } },
        { new: true, upsert: true }
    );
    return settings;
};

module.exports = {
    getSettings,
    updateTaxAndGst,
    updatePenalty,
};

