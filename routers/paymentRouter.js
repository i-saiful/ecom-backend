const router = require('express').Router();
const { initPayment } = require('../controllers/paymentController');
const authorize = require('../middlewares/authorize')

router.route('/')
    .get(authorize, initPayment)

module.exports = router