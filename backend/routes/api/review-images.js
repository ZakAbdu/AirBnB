//backend/routes/api/review-images.js
const express = require('express');
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { ReviewImage } = require('../../db/models');

// Delete an existing image for a Review
router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const { imageId } = req.params;
    const { id: userId } = req.user;

    const image = await ReviewImage.findByPk(imageId);

    if(!image) {
        return res.status(404).json({
            message: "Review Image couldn't be found",
            statusCode: 404
          })
    }

    const review = await image.getReview();
    if(userId !== review.userId) {
        return next({
            title: "Authorization error",
            status: 403,
            message: "Review-Image doesn't belong to the current user."
        });
    }

    await image.destroy();

    res.json({
        message: 'Successfully deleted.',
        statusCode: 200
    })
})

module.exports = router;