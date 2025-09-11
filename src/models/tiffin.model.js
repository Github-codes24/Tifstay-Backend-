const mongoose = require("mongoose");

const PricingSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["dining", "delivery"], required: true },
    duration: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const MealPrefSchema = new mongoose.Schema(
  {
    mealType: String,
    startTime: String,
    endTime: String
  },
  { _id: false }
);

const LocationSchema = new mongoose.Schema(
  {
    area: String,
    landmark: String,
    fullAddress: String,
    radiusKm: Number
  },
  { _id: false }
);

const ContactSchema = new mongoose.Schema(
  {
    phone: String,
    whatsapp: String
  },
  { _id: false }
);

const TiffinSchema = new mongoose.Schema(
  {
    // owner (optional)
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

    // Step 1: Basic Info
    name: { type: String, required: true },
    description: { type: String },
    mealPreference: [MealPrefSchema],
    foodType: { type: String, enum: ["veg", "non-veg", "both"], default: "veg" },
    whatsIncluded: [String],
    orderType: [{ type: String, enum: ["dining", "delivery"] }],
    pricing: [PricingSchema],
    photos: [String],
    offers: String,
    serviceFeatures: [String],
    location: LocationSchema,
    contact: ContactSchema,

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
