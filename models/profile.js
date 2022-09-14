const {Schema, model} = require('mongoose')

exports.Profile = model('prifile', Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    phone: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    postCode: Number,
    country: String
}))