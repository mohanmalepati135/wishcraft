const Analytics = require('../models/Analytics');
const Template = require('../models/Template');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalViews = await Analytics.countDocuments({ action: 'view' });
    const totalShares = await Analytics.countDocuments({ action: 'share' });
    const totalDownloads = await Analytics.countDocuments({ action: 'download' });
    const totalUsers = await User.countDocuments({ isGuest: false });
    const totalGuests = await User.countDocuments({ isGuest: true });
    const totalTemplates = await Template.countDocuments();
    const premiumTemplates = await Template.countDocuments({ isPremium: true });

    // Category breakdown
    const categoryStats = await Analytics.aggregate([
      { $match: { action: 'view' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Top templates
    const topTemplates = await Template.find().sort({ viewCount: -1 }).limit(5).select('title viewCount shareCount downloadCount category');

    // Daily stats (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const dailyStats = await Analytics.aggregate([
      { $match: { timestamp: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          views: { $sum: { $cond: [{ $eq: ['$action', 'view'] }, 1, 0] } },
          shares: { $sum: { $cond: [{ $eq: ['$action', 'share'] }, 1, 0] } },
          downloads: { $sum: { $cond: [{ $eq: ['$action', 'download'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalViews, totalShares, totalDownloads,
      totalUsers, totalGuests, totalTemplates, premiumTemplates,
      categoryStats, topTemplates, dailyStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
