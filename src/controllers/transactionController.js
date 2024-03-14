const catchAsync        = require('../middlewares/catchAsync');
const { messageQueue }  = require('../utils/amqpHelper');
const Transaction       = require('../models/transactionModel');
const Wallet            = require('../models/walletModel');


// CREATE TRANSACTION
exports.createTransaction = catchAsync(async (req, res, next) => {
    let { name, amount, tag='' } = req.body;

    const metadata = {
        'tag': tag
    }

    const wallet = await Wallet.findOne({ user_id: req.user._id });
    let walletBalance = wallet.balance;

    // check walletbalance and restrict
    if (walletBalance-amount <= 0) {
        return res.status(400).json({
            status: 'failure',
            data: {},
            message: 'Insufficient wallet balance'
        })
    }

    // deduct from wallet
    walletBalance = Number(walletBalance) - Number(amount);
    wallet.balance = walletBalance;
    await wallet.save();

    const newTxn = await Transaction.create({
        metadata: metadata,
        user_id: req.user._id,
        amount: amount,
        name: name
    })

    // send message to bank service queue
    const message = {
        'payload': {
            'data': {
                'id': newTxn._id,
                'txn_id': newTxn.txn_id,
                'metadata': newTxn.metadata,
                'created_at': newTxn.created_at
            },
            'metadata': {
                'signature': ''
            },
            'extra_data': {}
        }
    }
    
    messageQueue(message)
        .then(() => {
            res.status(201).json({
                status: 'success',
                data: {
                    transaction: newTxn
                }
            })
        })
        .catch(err => {
            console.log(err);
        })

});


// GET TRANSACTION
exports.getTransactions = catchAsync(async (req, res, next) => {
    const user_id = req.user._id;

    Transaction.find({ user_id: user_id })
        .then((results) => {
            res.status(200).json({
                status: 'success',
                data: {
                    results
                }
            })        })
        .catch((error) => {
            res.status(400).json({
                status: 'failure',
                data: {
                    data: null
                }
            })
        })
})


// SINGLE TRANSACTION
exports.singleTransaction = catchAsync(async (req, res, next) => {
    const user_id = req.user._id;
    const txn_id = req.query.txn_id

    Transaction.findOne({ _id: txn_id, user_id: user_id })
        .then((results) => {
            res.status(200).json({
                status: 'success',
                data: {
                    results
                }
            })
        })
        .catch((error) => {
            res.status(400).json({
                status: 'failure',
                data: {
                    data: null
                }
            })
        })
})


// SUMMARY
exports.transactionSummary = catchAsync(async (req, res, next) => {
    const user_id = req.user._id;
    
    // fetch transaction summary
    const summary = await Transaction.aggregate([
        {
            $match: { user_id: user_id }
        },
        {
            $group: {
                _id: '$user_id',
                totalAmount: { $sum: '$amount' }
            }
        }
    ])
    
    // fetch wallet balance
    let balance = 0;
    await Wallet.findOne({ user_id: user_id })
        .then(result => {
            balance = result.balance;
        })
        .catch(err => {
            console.log(err);
        })

    if (summary.length === 0) {
        return res.status(404).json({
            status: 'failure',
            data: {},
            message: 'No transactions found'
        })
    }

    return res.status(200).json({
        status: 'success',
        data: {
            used: summary[0].totalAmount,
            available: balance
        }
    })
})