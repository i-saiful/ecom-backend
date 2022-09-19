const PaymentSession = require('ssl-commerz-node').PaymentSession;
const { CartItem } = require('../models/cartItem')
const { Profile } = require('../models/profile')

module.exports.ipn = async(req, res) => {
    console.log(req.body);
}

module.exports.initPayment = async (req, res) => {
    const userId = req.user._id
    const cartItems = await CartItem.find({ user: userId })

    const profile = await Profile.findOne({ user: userId });

    const total_amount = cartItems.map(item =>
        item.count * item.price)
        .reduce((a, b) => a + b, 0)

    const total_item = cartItems.map(item => item.count)
        .reduce((a, b) => a + b, 0);

    const tran_id = '_' + Math.random().toString(36).substr(2, 9) + (new Date()).getTime();

    const payment = new PaymentSession(
        true,
        process.env.SSLCOMMERZ_STORE_ID,
        process.env.SSLCOMMERZ_STORE_PASSWORD
    );

    // Set the urls
    payment.setUrls({
        success: "yoursite.com/success",
        fail: "yoursite.com/fail",
        cancel: "yoursite.com/cancel",
        ipn: "https://ecom-backend-saiful-lab.herokuapp.com/api/payment/ipn",
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
    return res.send(response)
}