const jwt        = require('jsonwebtoken');
const User       = require('../models/userModel');
const catchAsync = require('./catchAsync');


exports.isAuthenticated = catchAsync(async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // verify the token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);

    next();
});