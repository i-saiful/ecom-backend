require('../config/authFacebook')
const router = require('express').Router()
const passport = require('passport')

router.route('/facebook')
    .get(passport.authenticate('facebook', { scope: ['email'] }))
router.route('/facebook/callback')
    .get(passport.authenticate('facebook', { session: false }),
        (req, res) => res.redirect(`https://ecom-bohubrihi-772b1.web.app/login?${req.user}`)
    )


module.exports = router