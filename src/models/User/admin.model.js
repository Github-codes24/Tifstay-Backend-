const User = require('./user.model');
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  roleLevel: { type: String, enum: ['super', 'moderator'], default: 'moderator' },
  address: String
});

module.exports = User.discriminator('admin', AdminSchema);
