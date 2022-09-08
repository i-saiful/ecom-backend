const router = require('express').Router();
const { signIn, signUp } = require('../controllers/userController')

router.route('/signin')
    .post(signIn)

router.route('/signup')
    .post(signUp)

module.exports = router