const router = require('express').Router();
const { initPayment, ipn, paymentSuccess, paymentCancel, paymentFail } = require('../controllers/paymentController');
const authorize = require('../middlewares/authorize')

router.route('/')
    .get(authorize, initPayment)

router.route('/success')
    .post(paymentSuccess)

router.route('/cancel')
    .post(paymentCancel)

router.route('/fail')
    .post(paymentFail)

module.exports = router