const express             = require('express');
const { externalAccessMiddleware } = require('../middlewares/externalAccessMiddleware');
const { 
    webhookController
} = require('../controllers/externalController');

const router = express()

router.route('/webhook/update-transaction').post(externalAccessMiddleware, webhookController);

module.exports = router;