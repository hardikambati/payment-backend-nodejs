const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email address'],
        unique: [true, 'Email already exists']
    },
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: [true, 'Username already exists'],
        minlength: [6, 'Username must be of minimum 6 characters']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password must be of minimum 6 characters'],
        select: false
    }
});


userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password=await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.generateToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = mongoose.model('User', userSchema);