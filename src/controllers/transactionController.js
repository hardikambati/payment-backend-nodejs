const catchAsync     = require('../middlewares/catchAsync');
const Transaction    = require('../models/transactionModel');
const websocketUsers = require('../utils/socketUsers');


// CREATE TRANSACTION
exports.createTransaction = catchAsync(async (req, res, next) => {
    const { tag } = req.body;

    if (tag !== '') {
        const metadata = {
            'tag': tag
        }

        const newTxn = await Transaction.create({
            metadata: metadata,
            user_id: req.user._id
        })

        res.status(201).json({
            status: 'success',
            data: {
                transaction: newTxn
            }
        })
    }
});


// GET TRANSACTION
exports.getTransactions = catchAsync(async (req, res, next) => {
    const user_id = req.user._id;

    let io = req.app.get('socketio');

    // Function to get socketId based on userId
    const getSocketIdByUserId = (userId) => {
        const user = websocketUsers.find((user) => user.userId === userId);
        return user ? user.socketId : null;
    };

    // send message to connected socket
    const socket_id = getSocketIdByUserId(user_id.toString());
    io.to(socket_id).emit('transactionStatus', 'success');
    
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