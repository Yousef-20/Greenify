const UserModel = require('../models/UserModel');
const generateToken = require('../utils/generateToken');

class UserController {
    // @desc    Register a new user
    // @route   POST /api/users/register
    // @access  Public
    async registerUser(req, res) {
        try {
            const { username, email, password, role } = req.body;

            // Check if user exists
            const userExists = await UserModel.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create user
            const user = await UserModel.create({
                username,
                email,
                password,
                role: role || 'user', // Default to 'user' if role is not provided
            });

            if (user) {
                res.status(201).json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id),
                });
            } else {
                res.status(400).json({ message: 'Invalid user data' });
            }
        } catch (error) {
            if (error.code === 11000) {
                // Handle duplicate key error
                const field = Object.keys(error.keyPattern)[0]; // Get the duplicate field
                res.status(400).json({ message: `${field} is already taken` });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    // @desc    Authenticate user & get token
    // @route   POST /api/users/login
    // @access  Public
    async login(req, res) {
        try {
            const { username, password } = req.body;

            const user = await UserModel.findOne({ username });

            if (user && (await user.matchPassword(password))) {
                res.json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    token: generateToken(user._id),
                });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Get user profile
    // @route   GET /api/users/profile
    // @access  Private
    async getUserProfile(req, res) {
        try {
            const user = await UserModel.findByIdSelect(req.user._id, '-password');
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new UserController(); 