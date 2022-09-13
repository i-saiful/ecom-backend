const router = require('express').Router()
const admin = require('../middlewares/admin')
const authorize = require('../middlewares/authorize')
const {
    createProduct,
    getProducts,
    getProductById,
    updateProductById,
    getPhoto
} = require('../controllers/productController')

router.route('/')
    .get(getProducts)
    .post([authorize, admin], createProduct)

router.route('/:id')
    .get(getProductById)
    .put([authorize, admin], updateProductById)

router.route('/photo/:id')
    .get(getPhoto)

module.exports = router