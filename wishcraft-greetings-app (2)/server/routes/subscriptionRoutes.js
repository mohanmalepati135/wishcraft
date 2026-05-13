const express = require('express');
const router = express.Router();
const { getPlans, createSubscription } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/plans', getPlans);
router.post('/', protect, createSubscription);

module.exports = router;
