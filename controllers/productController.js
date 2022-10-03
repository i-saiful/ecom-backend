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

// api/product?order=desc&sortBy=name&limit=10
exports.getProducts = async (req, res) => {
    const order = req.query.order === 'desc' ? -1 : 1
    const sortBy = req.query.sortBy ??= '_id'
    const limit = +req.query.limit < 10 ? +req.query.limit : 10
    // console.log('order=', order, 'sortBy=', sortBy, 'limit=', limit, ' given limit = ', req.query.limit);
    // console.log(typeof order, typeof sortBy, typeof limit);
    const products = await Product.find()
        .select({ photo: 0 })
        .sort({ [sortBy]: order })
        .limit(limit)
        .populate('category', 'name')
    // console.log(req.query);
    return res.send(products)
}

exports.getProductById = async (req, res) => {
    const productId = req.params.id
    const products = await Product.findById(productId)
        .select({ photo: 0 })
        .populate('category', 'name')

    if (products)
        return res.send(products);
    else
        return res.status(400).send("products not found")
}

exports.getPhoto = async (req, res) => {
    const productId = req.params.id
    const product = await Product.findById(productId)
        .select('photo')
    if (product) {
        res.set('Content-Type', product.photo.contentType)
        return res.send(product.photo.data);
    } else
        return res.status(400).send("photo not found")
}

exports.updateProductById = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        let form = new formidable.IncomingForm();
        form.keepExtensions = true
        form.parse(req, (err, feilds, files) => {
            if (err)
                return res.status(400).send("Something wrong!")
            const updateFeilds = _.pick(feilds, ['name', 'description', 'price', 'category', 'quantity'])
            _.assignIn(product, updateFeilds)
            if (files.photo) {
                fs.readFile(files.photo.filepath, (err, data) => {
                    if (err)
                        return res.status(400).send("problem in file data!")
                    product.photo.data = data;
                    product.photo.contentType = files.photo.mimetype;
                    product.save((err, result) => {
                        if (err)
                            res.status(500).send("Internal server problem")
                        else
                            return res.status(200).send({ message: "product update successfull!" });
                    });
                })
            } else {
                product.save((err, result) => {
                    if (err)
                        res.status(500).send("Internal server problem")
                    else
                        return res.status(200).send({ message: "product update successfull!" });
                });
            }
        })
    } else
        return res.status(400).send("products not found")
}

// const order = req.query.order === 'desc' ? -1 : 1
// const sortBy = req.query.sortBy ??= '_id'
// const limit = +req.query.limit < 10 ? +req.query.limit : 10
exports.filterProducts = async (req, res) => {
    const order = req.body.order === 'desc' ? -1 : 1
    const sortBy = req.body.sortBy ??= '_id'
    const limit = +req.body.limit ? +req.body.limit : 10
    const skip = +req.body.skip
    const filters = req.body.filters
    const args = {}

    for (const key in filters) {
        if (filters[key].length > 0) {
            if (key === 'price') {
                args[key] = {
                    $gte: filters[key][0],
                    $lte: filters[key][1]
                }
            }
            if (key === 'category') {
                args[key] = {
                    $in: filters[key]
                }
            }
        }
        if (key === 'search') {
            args['name'] = {
                $regex: filters[key], $options: 'i'
            }
        }
    }
    // console.log(skip)
    const products = await Product.find(args)
        .select({ photo: 0 })
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)
        .populate('category', 'name')

    res.send(products)
}
