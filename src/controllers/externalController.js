const catchAsync     = require('../middlewares/catchAsync');
const Transaction    = require('../models/transactionModel');
const websocketUsers = require('../utils/socketUsers');


// WEBHOOK MESSAGE
exports.webhookController = catchAsync(async (req, res, next) => {
    // send message to connected socket
    // const socket_id = getSocketIdByUserId(user_id.toString());
    // io.to(socket_id).emit('transactionStatus', 'success');
});
