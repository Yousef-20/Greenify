const express = require('express');
const { protect, isUser, isCleaner, isCleanerOrUser } = require('../middlewares/authMiddleware');
const { createCleaningRequest, getCleaningRequests, acceptCleaningRequest, placeBid } = require('../controllers/cleaningRequestController');

const router = express.Router();

// Create a new cleaning request (only users)
router.post('/', protect, isUser, createCleaningRequest);

// Get all cleaning requests (everyone can view)
router.get('/', getCleaningRequests);

// Accept a cleaning request (only cleaners)
router.put('/:id/accept', protect, isCleanerOrUser, acceptCleaningRequest);

// Place a bid on a cleaning request (only cleaners)
router.put('/:id/bid', protect, isCleaner, placeBid);

module.exports = router; 