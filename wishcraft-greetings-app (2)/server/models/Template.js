const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Shayari', 'Birthday', 'Anniversary', 'Festivals', 'Joke', 'Updesh', 'More', 'Love', 'Friendship', 'Motivation']
  },
  backgroundImage: { type: String, required: true },
  quoteText: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  tags: [{ type: String }],
  trending: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  shareCount: { type: Number, default: 0 },
  downloadCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', templateSchema);
