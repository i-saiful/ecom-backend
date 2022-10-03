const authorize = require('../middlewares/authorize');
const router = require('express').Router();
const { createFeedback, getFeedback } = require('../controllers/feedbackController')

router.route('/')
    .get(getFeedback)
    .post(authorize, createFeedback)

module.exports = router