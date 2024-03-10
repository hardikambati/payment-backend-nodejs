const express             = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const { 
    createTransaction,
    getTransactions,
    singleTransaction,
} = require('../controllers/transactionController');

const router = express()

router.route('/create').post(isAuthenticated, createTransaction);
router.route('/all').get(isAuthenticated, getTransactions);
router.route('/detail').get(isAuthenticated, singleTransaction);

module.exports = router;