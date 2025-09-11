const mongoose = require('mongoose');

const HostelOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  planType: { type: String, enum: ['daily','monthly','yearly'], default: 'monthly' },
  checkIn: Date,
  checkOut: Date,
  occupants: { type: Number, default: 1 },
  price: Number,
  deposit: Number,
  paymentMethod: { type: String, enum: ['online','bank','cash'], default: 'online' },
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  status: { type: String, enum: ['requested','approved','booked','checked_in','checked_out','cancelled'], default: 'requested' },
  documents: { aadhaarUrl: String, photoUrl: String },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('HostelOrder', HostelOrderSchema);