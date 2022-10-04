const { Coupon } = require("../models/coupon");

exports.createCoupon = async (req, res) => {
    // console.log(req.body);
    const data = {
        name: req.body.name || (Date.now().toString(36) +
            Math.random().toString(36).slice(2)).toUpperCase(),
        amount: +req.body.amount <= 0 ? 0 : +req.body.amount
    }
    const coupon = Coupon(data)
    try {
        await coupon.save()
        res.status(201).send(`Succesfully Create a Coupon! "${data.name}"`)
    } catch (err) {
        res.send('Coupon Name already Exits! or Amount is not Valid')
    }
}

exports.getCoupon = async (req, res) => {
    const response = await Coupon.find()
        .select({ updatedAt: 0 })
        .sort({ createdAt: -1 })
    res.send(response)
}

exports.checkCoupon = async (req, res) => {
    // console.log(req.headers.coupon);
    const response = await Coupon.findOne({ name: req.headers.coupon })
        .select({ amount: 1, name: 1 })
    res.send(response)
}