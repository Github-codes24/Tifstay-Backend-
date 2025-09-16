// src/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const BankSchema = new mongoose.Schema({
  accountNumber: { type: String },        // made optional
  ifsc: { type: String },
  accountType: { type: String, enum: ['Savings', 'Current'], default: 'Savings' },
  accountName: { type: String }
}, { _id: false });

const GuestSchema = new mongoose.Schema({
  aadhaarNumber: { type: String },        // made optional
  aadhaarCardUrl: { type: String }, // file upload path / cloud URL
  digilockerVerified: { type: Boolean, default: false }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String }, // may be null for guest/social login
  phone: { type: String },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  avatar: { type: String },

  profile: { 
    type: String, 
    enum: ['admin', 'guest', 'hostel_owner', 'tiffin_provider'], 
    // required: true 
  },

  address: { type: String },

  // conditional fields
  bank: BankSchema,   // only for hostel_owner / tiffin_provider
  guest: GuestSchema, // only for guest users

  status: { type: String, enum: ['active', 'disabled'], default: 'active' },

  // reset password
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

/**
 * Middleware: Hash password if modified
 */
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare passwords
 */
UserSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

/**
 * Generate reset password token
 */
UserSchema.methods.generatePasswordReset = function() {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  return token;
};

/**
 * Clear reset token
 */
UserSchema.methods.clearPasswordReset = function() {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
};

/**
 * Hide sensitive fields in JSON
 */
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    return ret;
  }
});

module.exports = mongoose.model('User', UserSchema);
