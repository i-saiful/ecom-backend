const router = require('express').Router()
const authorize = require('../middlewares/authorize')
const {
    createCartItem,
    getCartItem,
    updateCartItem,
    deleteCartItem
} = require('../controllers/cartController')

router.route('/')
    .get(authorize, getCartItem)
    .post(authorize, createCartItem)
    .put(authorize, updateCartItem)

router.route('/:id')
    .delete(authorize, deleteCartItem)

module.exports = router