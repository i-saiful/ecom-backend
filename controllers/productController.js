const _ = require('lodash')
const { Product, Validate } = require('../models/product')
const formidable = require('formidable')
const fs = require('node:fs')

exports.createProduct = async (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, feilds, files) => {
        if (err)
            return res.status(400).send('Somthing went wrong!');

        const { error } = Validate(_.pick(feilds, ['name', 'description', 'price', 'category', 'quantity']))
        if (error)
            return res.status(400).send(error.details[0].message);

        const product = new Product(feilds)

        if (files.photo) {
            fs.readFile(files.photo.filepath, (error, data) => {
                if (error)
                    return res.status(400).send('problem in file data!')
                product.photo.data = data
                product.photo.contentType = files.photo.mimetype

                product.save((error, result) => {
                    if (error)
                        return res.status(500).send('Internal server problem!');
                    else
                        return res.status(201).send({
                            message: 'product created succesfully!',
                            data: _.pick(result, ['name', 'description', 'price', 'category', 'quantity'])
                        })
                })
            })
        } else {
            return res.status(400).send("No photo provided!");
        }
    })
}

exports.getProducts = async (req, res) => {
    const products = await Product.find().select({photo: 0})
    console.log('get producst');
    return res.send(products)
}

exports.getProductById = async (req, res) => {

}

exports.updateProductById = async (req, res) => {

}