const { Schema, model } = require('mongoose')
const Joi = require('joi');

exports.Category = model('category', Schema({
    name: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
}))

exports.Validate = category => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    })

    return schema.validate(category)
}