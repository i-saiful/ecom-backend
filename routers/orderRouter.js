const router = require('express').Router()
const authorize = require('../middlewares/authorize')
const { getOrder } = require('../controllers/orderController')

router.route('/')
    .get(authorize, getOrder)

module.exports = router