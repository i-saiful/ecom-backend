require('../config/authGoogle')
const router = require('express').Router()
const passport = require('passport')

router.route('/google')
    .get(passport.authenticate('google', { scope: ['profile', 'email'] }))

router.route('/google/callback')
    .get(passport.authenticate('google', { session: false }),
        (req, res) => {
            res.redirect(`https://ecom-bohubrihi-772b1.web.app/login?${req.user}`)
        }
    )

module.exports = router