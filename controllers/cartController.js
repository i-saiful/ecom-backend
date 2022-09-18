const _ = require('lodash')
const { CartItem } = require('../models/cartItem');

exports.createCartItem = async (req, res) => {
    const { price, product } = _.pick(req.body, ['price', 'product'])
    const item = await CartItem.findOne({
        user: req.user._id,
        product: product
    })

    if (item) {
        return res.status(400).send('item already exits!')
    } else {
        const cartItem = new CartItem({
            user: req.body._id,
            product: product,
            price: price
        })

        const result = await cartItem.save()
        return res.status(201).send({
            message: 'added to successfull',
            data: result
        })
    }
}

exports.getCartItem = async (req, res) => {
    const cartItems = await CartItem.find({
        user: req.user._id
    })
        .populate('product', 'name')
        .populate('user', 'name')
    return res.status(200).send(cartItems)
}

exports.updateCartItem = async (req, res) => {
    const { _id, count } = _.pick(req.body, ['_id', 'count'])
    const userId = req.user._id
    await CartItem.updateOne({
        _id: _id,
        user: userId
    }, {
        count: count
    })
    return res.send('item updated!')
}

exports.deleteCartItem = async (req, res) => {
    const id = req.params.id
    const userId = req.user._id
    await CartItem.deleteOne({
        _id: id,
        user: userId
    })
    return res.send('deleted!')
}
