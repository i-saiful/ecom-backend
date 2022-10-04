const { Schema, model } = require('mongoose')

exports.Coupon = model('coupon', Schema({
    name: {
        type:String,
        unique: true
    },
    amount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
}))