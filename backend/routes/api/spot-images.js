//backend/routes/api/spot-images.js
const express = require('express');
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { SpotImage } = require('../../db/models');

router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const { imageId } = req.params;
    const { id: userId} = req.user;

    const image = await SpotImage.findByPk(imageId);

    if(!image) {
        return res.status(404).json({
            message: "Spot Image couldn't be found",
            statusCode: 404
          })
    }

    const spot = await image.getSpot();
    if(userId !== spot.ownerId) {
        return next({
            title: "Authorization error",
            status: 403,
            message: "Spot-Image doesn't belong to the current user."
        });
    }

    await image.destroy();

    res.json({
        message: 'Successfully deleted.',
        statusCode: 200
    })
})


module.exports = router;
