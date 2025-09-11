const mongoose = require('mongoose');

// This schema defines the structure for coupons in your database.
const couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: [true, 'Coupon code is required.'],
        unique: true,
        trim: true,
        uppercase: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required.'],
    },
    termsAndConditions: {
        type: String,
        required: [true, 'Terms & Conditions are required.'],
    },
    offerOn: {
        type: String,
        required: true,
        enum: ['PG_HOSTEL', 'TIFFIN_RESTAURANT']
    },
    discountType: {
        type: String,
        required: true,
        enum: ['PERCENTAGE', 'FIXED_AMOUNT'],
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0,
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
    // Determines if the coupon applies to all providers or specific ones.
    appliesTo: {
        scope: {
            type: String,
            required: true,
            enum: ['ALL', 'PARTICULAR'],
            default: 'ALL',
        },
        // Stores ObjectIds of Hostels or Tiffins if scope is 'PARTICULAR'.
        ids: [{
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'offerOnModel' // Dynamic reference based on 'offerOn' field
        }]
    },
    // Controls where the coupon is visible to users.
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
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual property to dynamically map 'offerOn' to a Mongoose Model name.
// This is essential for the `refPath` in `appliesTo.ids` to work correctly.
couponSchema.virtual('offerOnModel').get(function() {
    if (this.offerOn === 'PG_HOSTEL') {
        return 'Hostel'; // Must match mongoose.model('Hostel', ...)
    } else if (this.offerOn === 'TIFFIN_RESTAURANT') {
        return 'Tiffin'; // Must match mongoose.model('Tiffin', ...)
    }
});

// Virtual property to dynamically determine the coupon status based on current date.
// This is not stored in the database.
couponSchema.virtual('status').get(function() {
    const now = new Date();
    if (now < this.startDate) {
        return 'Upcoming';
    } else if (now > this.endDate) {
        return 'Expired';
    } else {
        return 'Ongoing';
    }
});

// Middleware to run validations before saving a document.
couponSchema.pre('save', function(next) {
    if (this.endDate <= this.startDate) {
        return next(new Error('End date must be after start date.'));
    }
    if (this.discountType === 'PERCENTAGE' && this.discountValue > 100) {
        return next(new Error('Percentage discount cannot exceed 100.'));
    }
    if (this.appliesTo.scope === 'PARTICULAR' && (!this.appliesTo.ids || this.appliesTo.ids.length === 0)) {
        return next(new Error('For a particular scope, you must provide at least one provider ID.'));
    }
    next();
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;

