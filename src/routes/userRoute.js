const express             = require('express');
const { signupUser, loginUser } = require('../controllers/userController');

const router = express()

router.route('/signup').post(signupUser);
router.route('/login').post(loginUser);

module.exports = router;