const User = require('./user.model');
const mongoose = require('mongoose');

const TiffinProviderSchema = new mongoose.Schema({
  bank: {
    accountNumber: String,
    ifsc: String,
    accountType: { type: String, enum: ['Savings', 'Current'], default: 'Savings' },
    accountName: String
  },
  address: {
    street: String,
    postCode: String,
    fullAddress: String
  },
  licenseNumber: String
});

module.exports = User.discriminator('tiffin_provider', TiffinProviderSchema);
