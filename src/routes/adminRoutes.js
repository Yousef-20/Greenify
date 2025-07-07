const express = require('express');
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const { getAllUsers, deleteUser, updateUserRole, getAllCleaningRequests, deleteCleaningRequest } = require('../controllers/adminController');

const router = express.Router();

// Get all users
router.get('/users', protect, isAdmin, getAllUsers);

// Delete a user
router.delete('/users/:id', protect, isAdmin, deleteUser);

// Update user role
router.put('/users/:id/role', protect, isAdmin, updateUserRole);

// Get all cleaning requests
router.get('/cleaning-requests', protect, isAdmin, getAllCleaningRequests);

// Delete a cleaning request
router.delete('/cleaning-requests/:id', protect, isAdmin, deleteCleaningRequest);

module.exports = router; 