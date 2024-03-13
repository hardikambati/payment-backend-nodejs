const catchAsync     = require('../middlewares/catchAsync');
const Transaction    = require('../models/transactionModel');
const websocketUsers = require('../utils/socketUsers');


// Function to get socketId based on userId
const getSocketIdByUserId = (userId) => {
    const user = websocketUsers.find((user) => user.userId === userId);
    return user ? user.socketId : null;
};


// WEBHOOK MESSAGE
exports.webhookController = catchAsync(async (req, res, next) => {
    const data = req.body;

    const id = data.payload.data?.id;
    const txnId = data.payload.data?.txn_id;
    const status = data.payload.extra_data?.status;
    let userId = null;

    if (!id || !txnId) {
        res.status(400).json({
            status: 'failure',
            data: {},
            message: 'id or txn_id not found'
        })
    }

    if (!status) {
        res.status(400).json({
            status: 'failure',
            data: {},
            message: 'status not found'
        })
    }

    // find the user associated
    await Transaction.findOne({ txn_id: txnId })
        .populate('user_id')
        .then(transaction => {
            if (transaction) {
                userId = transaction.user_id._id.toString();
            } else {
                console.log('Transaction not found.');
                res.status(404).json({
                    status: 'failure',
                    data: {},
                    message: 'Transaction not found'
                })
            }
        })
        .catch(error => {
            console.error('Error finding transaction:', error);
            res.status(404).json({
                status: 'failure',
                data: {},
                message: 'Error while fetching transaction'
            })
        });

    await Transaction.findOneAndUpdate(
        { _id: id, txn_id: txnId },
        { $set: { 'status': status } },
        { new: true }
    )
        .then(results => {
            if (results) {
                res.status(201).json({
                    status: 'success',
                    data: {
                        results
                    }
                })
            } else {
                res.status(404).json({
                    status: 'failure',
                    data: {},
                    message: 'Transaction not found'
                })
            }
            
            let io = req.app.get('socketio');

            // send message to connected socket
            const socket_id = getSocketIdByUserId(userId);
            io.to(socket_id).emit('transactionStatus', status);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                status: 'failure',
                data: {},
                message: 'Error while updating transaction'
            })
        })

});
