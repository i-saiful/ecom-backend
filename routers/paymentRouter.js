const router = require('express').Router();
const { initPayment, ipn, paymentSuccess } = require('../controllers/paymentController');
const authorize = require('../middlewares/authorize')

router.route('/')
    .get(authorize, initPayment)

router.route('/ipn')
    .post(ipn)

router.route('/payment')
    .post(paymentSuccess)

module.exports = router