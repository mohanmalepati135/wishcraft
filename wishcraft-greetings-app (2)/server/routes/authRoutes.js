const express = require('express');
const router = express.Router();
const { register, login, guestLogin, getMe, updateProfile, googleAuth } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/guest', guestLogin);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('profilePicture'), updateProfile);

module.exports = router;
