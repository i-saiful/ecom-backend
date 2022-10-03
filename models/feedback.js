const { Schema, model } = require('mongoose')

exports.Feedback = model('feedback', Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    feedback: String,
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    }
}, {
    timestamps: true
}))