const { Schema, model } = require('mongoose')
const Joi = require('joi')

exports.Product = model('product', Schema({
    name: String,
    description: String,
    price: Number,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    quantity: Number,
    photo: {
        data: Buffer,
        contentType: String
    },
    review: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
}))

exports.Validate = product => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(255).required(),
        description: Joi.string().max(2000).required(),
        price: Joi.number().required(),
        category: Joi.string().required(),
        quantity: Joi.number().required()
    })

    return schema.validate(product)
}