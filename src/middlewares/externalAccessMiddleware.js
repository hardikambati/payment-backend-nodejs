const catchAsync = require('./catchAsync');


exports.externalAccessMiddleware = catchAsync(async (req, res, next) => {
    const msAccessKey = req.headers['ms_access_key'];
    
    if (!msAccessKey) {
        return res.status(401).json({ error: 'Access key not found' });
    }

    // verify access token
    if (msAccessKey !== process.env.MS_ACCESS_KEY) {
        return res.status(401).json({ error: 'Invalid access key' })

    }

    next();
});