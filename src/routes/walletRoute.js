const express             = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const { 
    rechargeWallet,    
} = require('../controllers/walletController');

const router = express()

router.route('/recharge').post(isAuthenticated, rechargeWallet);

module.exports = router;