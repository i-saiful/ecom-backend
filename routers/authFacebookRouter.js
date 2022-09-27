require('../config/authFacebook')
const router = require('express').Router()
const passport = require('passport')

router.route('/facebook')
    .get(passport.authenticate('facebook', { scope: ['email'] }))
router.route('/facebook/callback')
    .get(passport.authenticate('facebook', { session: false }),
        (req, res) => res.redirect(`http://localhost:3000/login?${req.user}`)
    )


module.exports = router