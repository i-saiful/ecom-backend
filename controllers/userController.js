const bcrypt = require('bcrypt');
const _ = require('lodash')
const { User, Validate } = require('../models/user');

module.exports.signUp = async (req, res) => {
    const { error } = Validate(req.body)
    if (error)
        return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (user)
        return res.status(400).send('Email already exits!');

    user = User(req.body)

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)
    const token = user.generateJWT();

    try {
        const result = await user.save();
        return res.status(201).send({
            message: 'Registration Successfull!',
            token: token,
            user: _.pick(result, ['_id', 'email', 'name'])
        })
    } catch (error) {
        return res.status(500).send('Something Failed!')
    }
}

module.exports.signIn = async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (user) {
        const validUser = await bcrypt.compare(req.body.password, user.password)
        if (validUser) {
            const token = user.generateJWT()
            return res.send({
                message: 'Login Successfull!',
                token: token,
                user: _.pick(user, ['_id', 'email', 'name'])
            })
        } else {
            return res.status(400).send('Invalid email or password');
        }
    } else {
        return res.status(400).send('Invalid email or password');
    }
}