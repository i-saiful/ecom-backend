const _ = require('lodash')
const { Category, Validate } = require('../models/category')

exports.createCategory = async (req, res) => {
    const { error } = Validate(_.pick(req.body, ['name']))
    if (error)
        return res.status(400).send(error.details[0].message)

    const category = new Category(_.pick(req.body, ['name']))

    const result = await category.save()
    return res.status(201).send({
        message: 'Category created successfully',
        data: {
            name: result.name
        }
    })
}

exports.getCategories = async (req, res) => {
    const category = await Category.find().sort({ name: 1 }).select({_id: 1, name: 1})
    return res.status(200).send(category)
}