// src/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const BankSchema = new mongoose.Schema({
  accountNumber: String,
  ifsc: String,
  accountType: { type: String, enum: ['Savings', 'Current'], default: 'Savings' },
  accountName: String
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String }, // if social login, may be null
  phone: { type: String },
  provider: { type: String, enum: ['local','google'], default: 'local' },
  avatar: { type: String },
  bank: BankSchema,

  // reset password
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

// Hash password before save if modified
UserSchema.pre('save', async function(next){
  if (!this.isModified('password')) return next();
  if (!this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare password
UserSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Generate reset token (returns plain token, store hashed)
UserSchema.methods.generatePasswordReset = function() {
  const token = crypto.randomBytes(20).toString('hex');
  // store hashed token
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  // expires in 1 hour
  this.resetPasswordExpires = Date.now() + 60*60*1000;
  return token;
};

UserSchema.methods.clearPasswordReset = function() {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
};

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    return ret;
  }
});

module.exports = mongoose.model('User', UserSchema);
