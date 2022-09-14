const { Schema, model } = require('mongoose');

const CartItemSchema = Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    price: Number,
    count: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
},{timestamps: true})

exports.CartItemSchema = CartItemSchema;
exports.CartItem = model('cartItem', CartItemSchema)