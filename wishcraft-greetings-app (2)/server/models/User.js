const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, sparse: true },
  password: { type: String },
  profilePicture: { type: String, default: '' },
  isGuest: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  googleId: { type: String, sparse: true },
  subscription: {
    plan: { type: String, enum: ['free', 'basic', 'standard', 'pro'], default: 'free' },
    expiresAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
