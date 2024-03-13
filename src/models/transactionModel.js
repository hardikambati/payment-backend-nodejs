const mongoose = require('mongoose');
const { v4: uuidv4 }     = require('uuid');


const transactionSchema = new mongoose.Schema({
    txn_id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        default: 0,
        required: true,
    },
    status: {
        type: String,
        enum: ['scheduled', 'success', 'failure'],
        default: 'scheduled',
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
});

module.exports = mongoose.model('Transaction', transactionSchema);