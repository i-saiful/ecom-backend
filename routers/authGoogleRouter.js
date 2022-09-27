require('../config/authGoogle')
const router = require('express').Router()
const passport = require('passport')

router.route('/google')
    .get(passport.authenticate('google', { scope: ['profile', 'email'] }))

router.route('/google/callback')
    .get(passport.authenticate('google', { session: false }),
        (req, res) => {
            res.redirect(`http://localhost:3000/login?${req.user}`)
        }
    )

module.exports = router