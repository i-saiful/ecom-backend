const PaymentSession = require('ssl-commerz-node').PaymentSession;
const { CartItem } = require('../models/cartItem');
const { Order } = require('../models/order');
// const { Payment } = require('../models/payment');
const { Profile } = require('../models/profile')
const path = require('path')

// module.exports.ipn = async (req, res) => {
//     const payment = new Payment(req.body)
//     const tran_id = payment['tran_id']

//     if (payment['status'] === 'VALID') {
//         const order = await Order.updateOne({
//             transaction_id: tran_id
//         }, { status: 'Success' })
//         await CartItem.deleteMany(order.cartItems)
//     } else {
//         await Order.deleteOne({ transaction_id: tran_id })
//     }
//     await payment.save()
//     res.send('IPN')
// }

module.exports.initPayment = async (req, res) => {
    const userId = req.user._id
    const cartItems = await CartItem.find({ user: userId })

    const profile = await Profile.findOne({ user: userId });

    const total_amount = cartItems.map(item =>
        item.count * item.price)
        .reduce((a, b) => a + b, 0)

    const total_item = cartItems.map(item => item.count)
        .reduce((a, b) => a + b, 0);

    // const tran_id = '_' + Math.random().toString(36).substr(2, 9) + (new Date()).getTime();
    const tran_id = crypto.randomUUID();

    const payment = new PaymentSession(
        true,
        process.env.SSLCOMMERZ_STORE_ID,
        process.env.SSLCOMMERZ_STORE_PASSWORD
    );

    // Set the urls
    payment.setUrls({
        success: "https://ecom-backend-saiful-lab.herokuapp.com/api/payment/success",
        fail: "https://ecom-backend-saiful-lab.herokuapp.com/api/payment/fail",
        cancel: "https://ecom-backend-saiful-lab.herokuapp.com/api/payment/cancel",
        ipn: "https://payment-gateway-saiful-lab.herokuapp.com/sslcommerz/ipn",
    });

    // Set order details
    payment.setOrderInfo({
        total_amount: total_amount, // Number field
        currency: "BDT", // Must be three character string
        tran_id: tran_id, // Unique Transaction id
        emi_option: 0, // 1 or 0
    });

    // Set customer info
    payment.setCusInfo({
        name: req.user.name,
        email: req.user.email,
        add1: profile.address1,
        add2: profile.address2,
        city: profile.city,
        state: profile.state,
        postcode: profile.postcode,
        country: profile.country,
        phone: profile.phone,
        fax: profile.phone,
    });

    // Set shipping info
    payment.setShippingInfo({
        method: "Courier", //Shipping method of the order. Example: YES or NO or Courier
        num_item: total_item,
        name: req.user.name,
        add1: profile.address1,
        add2: profile.address2,
        city: profile.city,
        state: profile.state,
        postcode: profile.postcode,
        country: profile.country,
    });

    // Set Product Profile
    payment.setProductInfo({
        product_name: "Computer",
        product_category: "Electronics",
        product_profile: "general",
    });

    const response = await payment.paymentInit()

    const order = new Order({
        cartItems: cartItems,
        user: userId,
        transaction_id: tran_id,
        address: profile
    })

    if (response.status === 'SUCCESS') {
        // order.sessionKey = response.sessionkey
        order['sessionKey'] = response['sessionkey'];
        await order.save()
    }

    return res.send(response)
}

exports.paymentSuccess = async (req, res) => {
    const tran_id = req.body['tran_id']

    if (req.body['status'] === 'VALID') {
        const order = await Order.updateOne({
            transaction_id: tran_id
        }, { status: 'Success' })
        await CartItem.deleteMany(order.cartItems)
    } else {
        await Order.deleteOne({ transaction_id: tran_id })
    }
    res.sendFile(path.join(__basedir + '/public/success.html'))
}

exports.paymentCancel = async (req, res) => {
    const tran_id = req.body['tran_id']

    if (req.body['status'] === 'CANCELLED') {
        await Order.deleteOne({ transaction_id: tran_id })
    }
    res.sendFile(path.join(__basedir + '/public/cancel.html'))
}

exports.paymentFail = async (req, res) => {
    const tran_id = req.body['tran_id']

    if (req.body['status'] === 'FAILED') {
        await Order.deleteOne({ transaction_id: tran_id })
    }
    res.sendFile(path.join(__basedir + '/public/fail.html'))
}