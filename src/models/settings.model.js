const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    taxAndGst: {
        gstin: {
            type: String,
            trim: true,
            default: 'GSTIN_NOT_SET',
        },
        gstPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
    },
    // Penalty settings object
    penalty: {
        tiffinRestaurantPenalty: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        pgHostelPenalty: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
    },
    // Future settings like commission, cashback, etc., can be added here
}, {
    timestamps: true,
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;

