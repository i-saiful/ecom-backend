const { Schema, model } = require('mongoose');

module.exports.Payment = model("Payment", Schema({
    status: String,
    tran_date: Date,
    tran_id: {
        type: String,
        unique: true,
    },
    val_id: String,
    amount: Number,
    store_amount: Number,
    card_type: String,
    card_no: String,
    currency: String,
    bank_tran_id: String,
    card_issuer: String,
    card_brand: String,
    card_issuer_country: String,
    card_issuer_country_code: String,
    currency_type: String,
    currency_amount: String,
    verify_sign: String,
    verify_key: String,
    risk_level: Number,
    risk_title: String,
}, { timestamps: true }));