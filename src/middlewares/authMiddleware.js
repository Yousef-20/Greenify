const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');



const protect = async (req, res, next) => {
    let token;

    // Check if the Authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Access the Mongoose model
            const User = UserModel.getModel();
            // Find the user by ID and exclude the password field
            req.user = await User.findById(decoded.id).select('-password');


            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            // Handle errors (e.g., invalid token, user not found)
            console.error('Error:', error);
            res.status(401).json({ message: 'Not authorized' });
        }
    }

    // If no token is provided, return an error
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

// Middleware to check if the user is a cleaner or a regular user
const isCleanerOrUser = (req, res, next) => {
    if (req.user.role === 'cleaner' || req.user.role === 'user') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Only cleaners or users can perform this action.' });
    }
};

// Export the middleware
module.exports = { protect, isUser, isCleaner, isAdmin, isCleanerOrUser };