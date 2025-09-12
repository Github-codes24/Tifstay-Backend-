const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Offer description is required.'],
        trim: true,
    },
    termsAndConditions: {
        type: String,
        required: [true, 'Terms & Conditions are required.'],
        trim: true,
    },
    offerOn: {
        type: String,
        required: true,
        enum: ['PG_HOSTEL', 'TIFFIN_RESTAURANT'],
    },
    discountType: {
        type: String,
        required: true,
        enum: ['PERCENTAGE', 'FIXED_AMOUNT'],
    },
    discountValue: {
        type: Number,
        required: true,
        min: [0, 'Discount value cannot be negative.'],
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    minOrderValue: {
        type: Number,
        default: 0,
    },
    maxDiscountAmount: {
        type: Number,
    },
    appliesTo: {
        scope: {
            type: String,
            required: true,
            enum: ['ALL', 'PARTICULAR'],
            default: 'ALL',
        },
        ids: [{
            type: mongoose.Schema.Types.ObjectId,
            // Dynamically reference the model based on the 'offerOn' field
            refPath: 'offerOnModel',
        }],
    },
    visibility: {
        type: String,
        required: true,
        enum: ['ALL_APPS', 'PROVIDER_APP_ONLY'],
        default: 'ALL_APPS',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// A virtual field to dynamically determine the correct model for population
offerSchema.virtual('offerOnModel').get(function() {
    if (this.offerOn === 'PG_HOSTEL') {
        return 'Hostel'; // Name of your Hostel model
    } else if (this.offerOn === 'TIFFIN_RESTAURANT') {
        return 'Tiffin'; // Name of your Tiffin model
    }
});

// Add a compound index for efficient filtering and searching
offerSchema.index({ offerOn: 1, startDate: 1, endDate: 1, isActive: 1 });
offerSchema.index({ description: 'text' });

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
