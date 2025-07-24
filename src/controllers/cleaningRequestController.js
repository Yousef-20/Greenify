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
            const cleaningRequests = await CleaningRequestModel.findSelect({}, '-cleanerBids');
            res.json(cleaningRequests);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Accept a cleaning request
    // @route   PUT /api/cleaning-requests/:id/accept
    // @access  Private/Cleaner or User
    async acceptCleaningRequest(req, res) {
        try {
            const cleaningRequest = await CleaningRequestModel.findById(req.params.id);

            if (cleaningRequest) {
                // If the requester is a cleaner, assign them to the request
                if (req.user.role === 'cleaner') {
                    cleaningRequest.cleanerId = req.user._id;

                    // Set the reward to the user's bid offer
                    cleaningRequest.reward = cleaningRequest.bidOffer;
                }

                // If the requester is a user, confirm the acceptance
                if (req.user.role === 'user') {
                    // Ensure the user is the one who created the request
                    if (cleaningRequest.userId.toString() !== req.user._id.toString()) {
                        return res.status(403).json({ message: 'Access denied. Only the user who created the request can confirm acceptance.' });
                    }

                    // Find the highest bid from the cleaner bids
                    const highestBid = cleaningRequest.cleanerBids.reduce((max, bid) => bid.bidAmount > max ? bid.bidAmount : max, 0);

                    // Set the reward to the highest bid offered by a cleaner
                    cleaningRequest.reward = highestBid;
                }

                // Remove all cleaner bids
                cleaningRequest.cleanerBids = [];

                // Save the updated cleaning request
                await cleaningRequest.save();

                // Return the updated cleaning request
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
            const cleaningRequest = await CleaningRequestModel.findByIdSelect(req.params.id);

            if (cleaningRequest) {
                // Remove all previous bids by the cleaner
                cleaningRequest.cleanerBids = cleaningRequest.cleanerBids.filter(
                    bid => bid.cleanerId.toString() !== req.user._id.toString()
                );

                // Add the new bid
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