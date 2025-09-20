const User = require('./user.model');
const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
  dob: Date,
  addresses: [
    {
      label: { type: String, enum: ['home', 'work', 'other'] },
      street: String,
      postCode: String,
      fullAddress: String,
      location: { lat: Number, lng: Number }
    }
  ],
  aadhaarNumber: String,
  aadhaarCardUrl: String,
  digilockerVerified: { type: Boolean, default: false }
});

module.exports = User.discriminator('guest', GuestSchema);
