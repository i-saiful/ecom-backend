const { Schema, model } = require("mongoose");
const { CartItemSchema } = require("./cartItem");

exports.Order = model('order', Schema({
    cartItems: [CartItemSchema],
    transaction_id: {
        type: String,
        unique: true
    },
    address: {
        phone: String,
        address1: String,
        address2: String,
        city: String,
        state: String,
        postcode: Number,
        country: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Success'],
        default: 'Pending'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    sessionKey: String,
    discount: {
        type: Number,
        default: 0
    }
},{timestamps: true}))