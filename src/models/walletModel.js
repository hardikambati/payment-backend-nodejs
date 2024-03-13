const mongoose = require('mongoose');


const walletSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      unique: true
    },
    balance: {
      type: Number,
      default: 0
    },
});

module.exports = mongoose.model('Wallet', walletSchema);