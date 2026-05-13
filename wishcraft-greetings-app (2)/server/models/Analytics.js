const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { 
    type: String, 
    enum: ['view', 'share', 'download', 'edit', 'click_premium'], 
    required: true 
  },
  category: { type: String },
  isPremium: { type: Boolean },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', analyticsSchema);
