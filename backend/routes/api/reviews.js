//backend/routes/api/reviews.js
const express = require('express');
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateReview } = require('../../utils/validation.js');
const sequelize = require('sequelize');
const { reviewExists, usersReview } = require('../../utils/error-handlers.js');
const e = require('express');


// Get all reviews of the Current User
router.get('/current', requireAuth, async(req, res) => {
    const userId = req.user.id;
    try {
        const reviews = await Review.findAll({
            where: {userId: userId },
            include: [
                {model: User, attributes: ['id', 'firstName', 'lastName']},
                {model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: [{ model: SpotImage, attributes: ['url', 'preview']}]},
                {model: ReviewImage, attributes: ['id', 'url']}
            ]
        });

        if(reviews.length === 0) {
            return res.status(204).json({message: 'No reviews found for the current user.'})
        }

      
        const reviewArr = reviews.map(review => {
            const eachReview = review.toJSON();
            const spotImages = eachReview.Spot.SpotImages || [];
            const previewImage = spotImages.find(spotImage => spotImage.preview)?.url;
            eachReview.Spot.previewImage = previewImage || 'No preview image available';
            delete eachReview.Spot.SpotImages;
            return eachReview;
          });
          
        res.json({Reviews: reviewArr})

    } catch (error) {
        res.status(500).json({message: 'Error getting reviews'})
    }
})

// Add an image to a review based on the reviews id
router.post('/:reviewId/images', requireAuth, reviewExists, usersReview, async(req, res) => {
    
        const { reviewId } = req.params;
        const { url } = req.body;
        const user = req.user;

        const review = await Review.findByPk(reviewId);

        const reviewImages = await review.getReviewImages();

        if (reviewImages.length >= 10) {
            return res.status(404).json({
                message: "Maximum number of images for this resource was reached.",
                statusCode: 403,
              })
          }

        const newImage = await review.createReviewImage({ url });

        res.json({
            id: newImage.id,
            url: newImage.url
        })
})

// Edit a review
router.put('/:reviewId', requireAuth, validateReview, reviewExists, usersReview, async(req, res) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const user = req.user;

    const newReview = await Review.findByPk(reviewId);

    newReview.review = review;
    newReview.stars = stars;

    await newReview.save();

    return res.json(newReview);
})

// Delete a review
router.delete('/:reviewId', requireAuth, reviewExists, usersReview, async(req, res) => {
    const { reviewId } = req.params;
    const user = req.user;

    const review = await Review.findByPk(reviewId);

    review.destroy();

    return res.json({
        message: 'Successfully deleted.',
        statusCode: 200
    });
})


module.exports = router;