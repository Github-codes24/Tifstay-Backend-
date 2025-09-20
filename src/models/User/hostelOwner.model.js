const User = require('./user.model');
const mongoose = require('mongoose');

const HostelOwnerSchema = new mongoose.Schema({
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
  }
});

module.exports = User.discriminator('hostel_owner', HostelOwnerSchema);
