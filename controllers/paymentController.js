const PaymentSession = require('ssl-commerz-node').PaymentSession;
const { CartItem } = require('../models/cartItem');
const { Order } = require('../models/order');
const { Profile } = require('../models/profile')
const path = require('path')
const crypto = require('node:crypto')
const SSLCommerzPayment = require('sslcommerz-lts');
const { Product } = require('../models/product');
const { Coupon } = require('../models/coupon');
const store_id = process.env.SSLCOMMERZ_STORE_ID
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD
const is_live = false

module.exports.initPayment = async (req, res) => {
    let discount = ''
    if (req.headers.coupon)
        discount = await Coupon.findOne({ name: req.headers.coupon }).select({ amount: 1 })
    // console.log('coupon after --');
    // console.log(discount.amount);
    const userId = req.user._id
    const cartItems = await CartItem.find({ user: userId })

    const profile = await Profile.findOne({ user: userId });

    const total_amount = cartItems.map(item =>
        item.count * item.price)
        .reduce((a, b) => a + b, 0) - discount.amount

    const total_item = cartItems.map(item => item.count)
        .reduce((a, b) => a + b, 0);

    const tran_id = crypto.randomUUID().split('-').join('').toUpperCase()

    const payment = new PaymentSession(
        true,
        process.env.SSLCOMMERZ_STORE_ID,
        process.env.SSLCOMMERZ_STORE_PASSWORD
    );

    // Set the urls
    payment.setUrls({
        // success: "https://ecom-backend-saiful-lab.herokuapp.com/api/payment/success",
        success: "http://localhost:3001/api/payment/success",
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
        address: profile,
        discount: discount.amount
    })

    if (response.status === 'SUCCESS') {
        order['sessionKey'] = response['sessionkey'];
        await order.save()
    }
    console.log(response);
    return res.send(response)
}

exports.paymentSuccess = async (req, res) => {
    const tran_id = req.body['tran_id']

    // SSLCommerz inital for validate
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)

    // Check validate
    const response = await sslcz.validate({ val_id: req.body['val_id'] })

    // Verify status, tran_id, amount, bank_tran_id
    const verify = () => req.body['status'] === response['status'] &&
        req.body['tran_id'] === response['tran_id'] &&
        req.body['amount'] === response['amount'] &&
        req.body['bank_tran_id'] === response['bank_tran_id']

    if (verify()) {
        // update order status pending to success
        const order = await Order.updateOne({
            transaction_id: tran_id
        }, { status: 'Success' })

        // find order collection using tran_id
        // populate product collection => sold, quantity
        const updateOrder = await Order.findOne({ transaction_id: tran_id })
            .select({ cartItems: 1 })
            .populate({
                path: 'cartItems',
                populate: {
                    path: 'product',
                    select: 'sold quantity'
                }
            })

        // update product collection => sold, quantity
        updateOrder.cartItems.map(async item => {
            const result = await Product.updateOne({ _id: item.product._id },
                {
                    sold: item.count + item.product.sold,
                    quantity: item.product.quantity - item.count
                })
        })

        await CartItem.deleteMany(order.cartItems)
        res.sendFile(path.join(__basedir + '/public/success.html'))
    } else {
        await Order.deleteOne({ transaction_id: tran_id })
        res.sendFile(path.join(__basedir + '/public/fail.html'))
    }
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