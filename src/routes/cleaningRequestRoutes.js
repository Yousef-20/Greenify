const express = require('express');
const { protect, isUser, isCleaner } = require('../middlewares/authMiddleware');
const { createCleaningRequest, getCleaningRequests, acceptCleaningRequest, placeBid } = require('../controllers/cleaningRequestController');

const router = express.Router();

// Create a new cleaning request (only users)
router.post('/', protect, isUser, createCleaningRequest);

// Get all cleaning requests (both users and cleaners can view)
router.get('/', protect, getCleaningRequests);

// Accept a cleaning request (only cleaners)
router.put('/:id/accept', protect, isCleaner, acceptCleaningRequest);

// Place a bid on a cleaning request (only cleaners)
router.put('/:id/bid', protect, isCleaner, placeBid);

module.exports = router; 