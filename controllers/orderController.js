const { Order } = require('../models/order');

exports.getOrder = async (req, res) => {
    const userId = req.user._id;
    const result = await Order.find({ user: userId })
        .select({
            address: 1,
            cartItems: 1,
            transaction_id: 1,
            _id: 1,
            status: 1,
            createdAt: 1,
            discount: 1
        })
        .sort({
            createdAt: -1
        })
        .populate({
            path: 'cartItems',
            populate: {
                path: 'product',
                select: 'name'
            }
        })

    res.send(result)
}