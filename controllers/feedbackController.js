const { Feedback } = require('../models/feedback')
const _ = require('lodash')
const { Product } = require('../models/product')

exports.createFeedback = async (req, res) => {
    const feedback = Feedback({
        feedback: req.body.feedback,
        user: req.body.userId,
        product: req.body.productId
    })
    const result = await feedback.save();
    const response = _.pick(result, ['user', 'feedback'])

    const updateReview = await Product.findOne({ _id: req.body.productId })
        .select({ photo: 0 })
    let count = updateReview.review || 0
    count += 1
    updateReview.review = count
    const s = await updateReview.save()

    res.send(response)
}

exports.getFeedback = async (req, res) => {
    const result = await Feedback.find({ product: req.headers.product })
        .populate('user', 'name')

    // console.log(result);
    const response = result.map(item => ({
        id: item._id,
        userName: item.user.name,
        feedback: item.feedback,
        createdAt: item.createdAt
    }))
    res.send(response)
}