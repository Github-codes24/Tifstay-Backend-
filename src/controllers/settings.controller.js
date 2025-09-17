const settingsService = require('../services/settings.service');
const { ok } = require('../utils/response');

// --- Tax & GST Functions ---
const getTaxAndGst = async (req, res, next) => {
    try {
        const settings = await settingsService.getSettings();
        return ok(res, { message: 'Tax & GST settings retrieved successfully.', data: settings.taxAndGst });
    } catch (error) {
        next(error);
    }
};

const updateTaxAndGst = async (req, res, next) => {
    try {
        const settings = await settingsService.updateTaxAndGst(req.body);
        return ok(res, { message: 'Tax & GST settings updated successfully.', data: settings.taxAndGst });
    } catch (error) {
        next(error);
    }
};

// --- New Penalty Functions ---
const getPenalty = async (req, res, next) => {
    try {
        const settings = await settingsService.getSettings();
        return ok(res, { message: 'Penalty settings retrieved successfully.', data: settings.penalty });
    } catch (error) {
        next(error);
    }
};

const updatePenalty = async (req, res, next) => {
    try {
        const settings = await settingsService.updatePenalty(req.body);
        return ok(res, { message: 'Penalty settings updated successfully.', data: settings.penalty });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTaxAndGst,
    updateTaxAndGst,
    getPenalty,
    updatePenalty,
};

