const mongoose = require('mongoose');

const staticPageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Page title is required.'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Page description/content is required.'],
    },
    isPublished: {
        type: Boolean,
        default: true, // Pages are published by default
    },
}, {
    timestamps: true,
});

staticPageSchema.index({ title: 'text' });

const StaticPage = mongoose.model('StaticPage', staticPageSchema);

module.exports = StaticPage;
