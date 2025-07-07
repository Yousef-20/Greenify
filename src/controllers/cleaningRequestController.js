const CleaningRequestModel = require('../models/CleaningRequestModel');
const UserModel = require('../models/UserModel');

// @desc    Create a new cleaning request
// @route   POST /api/cleaning-requests
// @access  Private (Only users)
class CleaningRequestController {
    async createCleaningRequest(req, res) {
        try {
            const { location, photos, bidOffer } = req.body;

            const cleaningRequest = await CleaningRequestModel.create({
                userId: req.user._id,
                location,
                photos,
                bidOffer,
            });

            res.status(201).json(cleaningRequest);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Get all cleaning requests
    // @route   GET /api/cleaning-requests
    // @access  Private (Both users and cleaners)
    async getCleaningRequests(req, res) {
        try {
            const cleaningRequests = await CleaningRequestModel.find({});
            res.json(cleaningRequests);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Accept a cleaning request
    // @route   PUT /api/cleaning-requests/:id/accept
    // @access  Private (Only cleaners)
    async acceptCleaningRequest(req, res) {
        try {
            const cleaningRequest = await CleaningRequestModel.findById(req.params.id);

            if (cleaningRequest) {
                cleaningRequest.status = 'accepted';
                cleaningRequest.cleanerId = req.user._id;
                await cleaningRequest.save();
                res.json(cleaningRequest);
            } else {
                res.status(404).json({ message: 'Cleaning request not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Place a bid on a cleaning request
    // @route   PUT /api/cleaning-requests/:id/bid
    // @access  Private (Only cleaners)
    async placeBid(req, res) {
        try {
            const { bidAmount } = req.body;
            const cleaningRequest = await CleaningRequestModel.findById(req.params.id);

            if (cleaningRequest) {
                cleaningRequest.cleanerBids.push({
                    cleanerId: req.user._id,
                    bidAmount,
                });
                await cleaningRequest.save();
                res.json(cleaningRequest);
            } else {
                res.status(404).json({ message: 'Cleaning request not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CleaningRequestController(); 