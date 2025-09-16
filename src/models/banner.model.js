const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    bannerType: {
        type: String,
        required: [true, 'Banner type is required.'],
        enum: ['Dashboard', 'Footer Banner', 'Top Banner', 'Contact Banner', 'Information Banner'],
        trim: true,
    },
    serviceType: {
        type: String,
        required: [true, 'Service type is required.'],
        enum: ['PG_HOSTEL', 'TIFFIN_RESTAURANT'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Banner image is required.'],
    },
    // This field will be used for the 'Published' / 'Not Published' status filter
    isPublished: {
        type: Boolean,
        default: true,
    },
}, {
    // This will automatically add createdAt and updatedAt fields
    timestamps: true,
});

// Create a text index on bannerType for searching
bannerSchema.index({ bannerType: 'text' });

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
