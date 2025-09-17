const express = require('express');
const settingsController = require('../controllers/settings.controller');

const router = express.Router();

// Tax & GST Route
router.route('/tax-gst')
    .get(settingsController.getTaxAndGst)
    .put(settingsController.updateTaxAndGst);

// Penalty Route
router.route('/penalty')
    .get(settingsController.getPenalty)
    .put(settingsController.updatePenalty);

module.exports = router;

