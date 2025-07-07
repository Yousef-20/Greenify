const mongoose = require('mongoose');
const BaseModel = require('./BaseModel');

const CleaningRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    photos: [{
        type: String,
        required: true,
    }],
    bidOffer: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ignored'],
        default: 'pending',
    },
    cleanerBids: [{
        cleanerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        bidAmount: {
            type: Number,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

class CleaningRequestModel extends BaseModel {
    constructor() {
        super(mongoose.model('CleaningRequest', CleaningRequestSchema));
    }
}

module.exports = new CleaningRequestModel(); 