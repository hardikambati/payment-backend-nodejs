const jwt        = require('jsonwebtoken');
const User       = require('../models/userModel');
const catchAsync = require('./catchAsync');


const socketMiddleware = (socket, next) => {
    const token = socket.handshake.query?.token;
    console.log(`[socket middleware] ${token}`);

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        const user = User.findById(decodedData.id);
        socket.user_id = decodedData.id;
    } catch (err) {
        return next(new Error('[socket middleware] authorization failed'));
    }

    next();
};

module.exports = socketMiddleware;
