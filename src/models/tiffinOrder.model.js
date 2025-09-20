const mongoose = require('mongoose');

const TiffinOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // tiffin provider
  tiffin: { type: mongoose.Schema.Types.ObjectId, ref: 'Tiffin', required: true },
  planType: { type: String, enum: ['daily','weekly','monthly','one-time'], default: 'daily' },
  quantity: { type: Number, default: 1 },
  startDate: Date,
  endDate: Date,
  mealPreference: [{ mealType: String, startTime: String, endTime: String }],
  deliveryAddress: {
    fullAddress: String,
    area: String,
    landmark: String,
    lat: Number,
    lng: Number
  },
  contactPhone: String,
  price: Number,
  paymentMethod: { type: String, enum: ['cod','online','wallet'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  status: { type: String, enum: ['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'], default: 'pending' },
  notes: String,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('TiffinOrder', TiffinOrderSchema);