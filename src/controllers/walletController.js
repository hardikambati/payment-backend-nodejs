const catchAsync = require('../middlewares/catchAsync');
const Wallet     = require('../models/walletModel');


// RECHARGE WALLET
exports.rechargeWallet = catchAsync(async (req, res, next) => {
    const { amount } = req.body;

    if (amount === null || amount <= 0) {
        res.status(400).json({
            status: 'failure',
            data: {},
            message: 'Invalid or no amount received'
        })
    }

    const wallet = await Wallet.findOne({ user_id: req.user._id });

    wallet.balance += amount;
    await wallet.save();

    res.status(201).json({
        status: 'success',
        data: {
            wallet
        }
    })
    
})

