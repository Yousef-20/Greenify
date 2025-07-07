const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');



const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token - METHOD 1: Using getModel()
            const User = UserModel.getModel(); // Access the Mongoose model
            req.user = await User.model.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check if the user is a regular user
const isUser = (req, res, next) => {
    if (req.user.role === 'user') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Only users can perform this action.' });
    }
};

// Middleware to check if the user is a cleaner
const isCleaner = (req, res, next) => {
    if (req.user.role === 'cleaner') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Only cleaners can perform this action.' });
    }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Only admins can perform this action.' });
    }
};

// Export the middleware
module.exports = { protect, isUser, isCleaner, isAdmin };