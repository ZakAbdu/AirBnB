//backend/routes/api/reviews.js
const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth, restoreUser} = require('../../utils/auth');
const { Spot, Review, SpotImage, ReviewImage, User, sequelize } = require('../../db/models');
const router = express.Router();

// Get all reviews of the Current User
router.get('/current', async(req, res) => {
    // const { user } = req;

    const reviews = await Review.findAll({
        include: [
            {model: User, attributes: ['id', 'firstName', 'lastName']},
            {model: Spot},
            {model: ReviewImage, attributes: ['id', 'url']}
           
        ]
    })
    res.json({
        Reviews: reviews
    })

})



module.exports = router;