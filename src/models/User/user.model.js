// src/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const options = { discriminatorKey: 'profile', timestamps: true };

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, index: true },
  password: { type: String },
  phone: { type: String },
  avatar: { type: String },

  provider: { type: String, enum: ['local', 'google', 'guest'], default: 'local' },
  status: { type: String, enum: ['active', 'disabled'], default: 'active' },

  resetPasswordToken: String,
  resetPasswordExpires: Date
}, options);

// hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.generatePasswordReset = function() {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  return token;
};

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    return ret;
  }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User;