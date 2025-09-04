const mongoose = require("mongoose");

const PricingSchema = new mongoose.Schema({
  type: { type: String, enum: ["dining", "delivery"], required: true },
  duration: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
  price: { type: Number, required: true }
});

const TiffinSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Step 1: Basic Info
    name: { type: String, required: true },
    description: String,
    mealPreference: [
      {
        mealType: { type: String, enum: ["breakfast", "lunch", "dinner"] },
        startTime: String,
        endTime: String
      }
    ],
    foodType: { type: String, enum: ["veg", "non-veg", "both"], default: "veg" },
    whatsIncluded: [String],
    orderType: [{ type: String, enum: ["dining", "delivery"] }],
    pricing: [PricingSchema],
    offers: String,

    // Step 2: Features, Photos, Location, Contact
    serviceFeatures: [String],
    photos: [String],
    location: {
      area: String,
      landmark: String,
      fullAddress: String,
      radiusKm: Number
    },
    contact: {
      phone: String,
      whatsapp: String
    },

    // Status
    status: {
      type: String,
      enum: ["draft", "submitted", "published"],
      default: "draft"
    },

    // optional timestamp for submit action
    submittedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tiffin", TiffinSchema);
