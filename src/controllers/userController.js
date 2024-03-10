const catchAsync = require('../middlewares/catchAsync');
const User       = require('../models/userModel');


// SIGN UP USER
exports.signupUser = catchAsync(async (req, res, next) => {
    const { name, email, username, password } = req.body;

    const user = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (user) {
        if (user.username === username) {
            return res.status(401).json({ error: 'Username already exists' });
        }
        return res.status(401).json({ error: 'Email already exists' });
    }

    const newUser = await User.create({
        name,
        email,
        username,
        password
    });
    
    const token = newUser.generateToken();

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
});


// LOGIN USER
exports.loginUser = catchAsync(async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findOne({
        $or: [{ username: username }]
    }).select('+password');

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = user.generateToken();

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: user
        }
    })
});