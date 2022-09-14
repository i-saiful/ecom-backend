const router = require('express').Router()
const authorize = require('../middlewares/authorize');
const {
    getProfile,
    setProfile
} = require('../controllers/profileController')

router.route('/')
    .get(authorize, getProfile)
    .post(authorize, setProfile)

module.exports = router