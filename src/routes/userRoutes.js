const express = require('express');
const { registerUser, login, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Authenticate user & get token
router.post('/login', login);

// Get user profile (protected route)
router.get('/profile', protect, getUserProfile);

module.exports = router; 