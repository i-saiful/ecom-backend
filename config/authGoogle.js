const passport = require('passport');
const { User } = require('../models/user');
const _ = require('lodash')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://ecom-backend-saiful-lab.herokuapp.com/api/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, cb) {
        // id, displayName, emails[0].value, provider
        let res = {}
        let user = await User.findOne({
            providerId: profile.id,
            email: profile._json.email
        })

        if (user) {
            const token = user.generateJWT();
            res = {
                message: 'Login Successfull!',
                token: token,
                user: _.pick(user, ['_id', 'email', 'name'])
            }
            cb(null, JSON.stringify(res))
        } else {
            user = {
                providerId: +profile.id,
                name: profile._json.name,
                email: profile._json.email,
                provider: profile.provider
            }
            user = User(user)
            const token = user.generateJWT();

            const result = await user.save()
            res = {
                message: 'Registration Successfull!',
                token: token,
                user: _.pick(result, ['_id', 'email', 'name'])
            }
            cb(null, JSON.stringify(res))
        }
        res.errorMessage = 'Something Wrong!'
        cb(null, JSON.stringify(res))
    }
));