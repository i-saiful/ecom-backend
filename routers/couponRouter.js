const router = require('express').Router()
const { createCoupon, getCoupon, checkCoupon } = require('../controllers/couponController')
const admin = require('../middlewares/admin')
const authorize = require('../middlewares/authorize')

router.route('/')
    .get([authorize, admin], getCoupon)
    .post([authorize, admin], createCoupon)

router.route('/check')
    .get(authorize, checkCoupon)

module.exports = router