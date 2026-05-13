const Razorpay = require('razorpay');
const crypto = require('crypto');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (req, res) => {
  try {
    const { plan, price } = req.body;

    const options = {
      amount: price * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        plan: plan,
        userName: req.user.name,
        userEmail: req.user.email || 'guest@wishcraft.com'
      }
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order error:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, price } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Create subscription record
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

    const subscription = await Subscription.create({
      userId: req.user._id,
      plan,
      price,
      startDate: new Date(),
      endDate,
      status: 'active'
    });

    // Update user subscription
    await User.findByIdAndUpdate(req.user._id, {
      'subscription.plan': plan.toLowerCase(),
      'subscription.expiresAt': endDate
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and subscription activated!',
      subscription
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};

exports.getKey = async (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
};
