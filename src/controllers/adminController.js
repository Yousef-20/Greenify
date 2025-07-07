const UserModel = require('../models/UserModel');
const CleaningRequestModel = require('../models/CleaningRequestModel');

class AdminController {
    // @desc    Get all users
    // @route   GET /api/admin/users
    // @access  Private/Admin
    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find({});
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Delete a user
    // @route   DELETE /api/admin/users/:id
    // @access  Private/Admin
    async deleteUser(req, res) {
        try {
            const user = await UserModel.findById(req.params.id);
            if (user) {
                await user.remove();
                res.json({ message: 'User removed' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Update user role
    // @route   PUT /api/admin/users/:id/role
    // @access  Private/Admin
    async updateUserRole(req, res) {
        try {
            const { role } = req.body;
            const user = await UserModel.findById(req.params.id);
            if (user) {
                user.role = role;
                await user.save();
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Get all cleaning requests
    // @route   GET /api/admin/cleaning-requests
    // @access  Private/Admin
    async getAllCleaningRequests(req, res) {
        try {
            const cleaningRequests = await CleaningRequestModel.find({});
            res.json(cleaningRequests);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Delete a cleaning request
    // @route   DELETE /api/admin/cleaning-requests/:id
    // @access  Private/Admin
    async deleteCleaningRequest(req, res) {
        try {
            const cleaningRequest = await CleaningRequestModel.findById(req.params.id);
            if (cleaningRequest) {
                await cleaningRequest.remove();
                res.json({ message: 'Cleaning request removed' });
            } else {
                res.status(404).json({ message: 'Cleaning request not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new AdminController(); 