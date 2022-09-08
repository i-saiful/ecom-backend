const router = require('express').Router()
const { createCategory, getCategories } = require('../controllers/categoryController')
const admin = require('../middlewares/admin')
const authorize = require('../middlewares/authorize')

router.route('/')
    .get(getCategories)
    .post([authorize, admin], createCategory)

module.exports = router