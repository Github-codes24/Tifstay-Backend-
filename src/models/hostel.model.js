// models/Hostel.js
const mongoose = require("mongoose");

const PricingSchema = new mongoose.Schema({
  type: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
  price: { type: Number, required: true },
  securityDeposit: { type: Number },
  offer: { type: String }, // e.g. "10% discount"
});

const RoomSchema = new mongoose.Schema({
  roomNo: { type: String, required: true },
  noOfBeds: { type: Number, required: true },
  details: { type: String },
});

const HostelSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Step 1: Basic Info
    name: { type: String, required: true },
    hostelType: { type: String, enum: ["Boys Hostel", "Girls Hostel", "PG"], required: true },
    description: String,

    // Pricing
    pricing: [PricingSchema],

    // Rooms
    rooms: [RoomSchema],

    // Photos
    photos: [String], // file paths

    // Facilities & Amenities
    facilities: [String], // e.g. Wifi, Mess, Security, etc.

    // Rules
    rules: [String],

    // Location
    location: {
      area: String,
      landmark: String,
      fullAddress: String,
    },

    // Contact
    contact: {
      phone: String,
      whatsapp: String,
    },

    status: {
      type: String,
      enum: ["draft", "submitted", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hostel", HostelSchema);
