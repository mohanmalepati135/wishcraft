const Subscription = require('../models/Subscription');

exports.getPlans = async (req, res) => {
  res.json([
    {
      id: 'basic', name: 'Basic', price: 49, period: 'month',
      features: ['Access to 50+ premium templates', 'Basic customization', 'Email support']
    },
    {
      id: 'standard', name: 'Standard', price: 99, period: 'month',
      popular: true,
      features: ['Access to 150+ premium templates', 'Advanced customization', 'Priority support', 'No watermark']
    },
    {
      id: 'pro', name: 'Pro', price: 199, period: 'month',
      features: ['Unlimited premium templates', 'Full customization suite', '24/7 dedicated support', 'No watermark', 'Early access']
    }
  ]);
};

exports.createSubscription = async (req, res) => {
  try {
    const { plan, price, endDate } = req.body;
    const subscription = await Subscription.create({
      userId: req.user._id, plan, price,
      endDate: new Date(endDate)
    });
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
