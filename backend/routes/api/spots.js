//backend/routes/api/spots.js
const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth, restoreUser} = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize } = require('../../db/models');
const e = require('express');
const router = express.Router();

router.get('/', async (req, res) => {

// Get all spots
const spots = await Spot.findAll({
    attributes: {
        include: [
            [ sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating' ],
            [ sequelize.col('SpotImages.url'), 'previewImage' ]
        ],
    },
    include: [
        { model: Review, attributes: [] },
        { model: SpotImage, attributes: [] }
     ]
})

res.json(spots);

})


// Get all spots owned by the current user
router.get('/current', restoreUser, async (req, res) => {
   
    const { user } = req;

    const spots = await Spot.findAll({
        attributes: {
            include: [
                [ sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating' ],
                [ sequelize.col('SpotImages.url'), 'previewImage' ]
            ]
        },
        include: [
            { model: Review, attributes: [] },
            { model: SpotImage, attributes: [] }
         ]
    })

    if (user) {
        return res.json(spots)
    } else return res.json({});
})

// Get details of a spot from an id
router.get('/:spotId', async(req, res) => {
    const spots = await Spot.findByPk(req.params.spotId, {
        // attributes: {
        //     include: [
        //         [ sequelize.fn('COUNT', sequelize.col('Reviews.review')), 'numReviews' ],
        //         [ sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgStarRating' ]
        //     ]
        // },
        // include: [
        //     { model: Review, attributes: [] },
        //     { model: SpotImage, attributes: ['id', 'url', 'preview'] },
        //     {model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName']}
        //  ]
    })

    if(!spots) {
        res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    res.json(spots)

})

// Create a spot
router.post('/', async(req, res) => {
    
    const { address, city, state, country, latitude, longitude, name, description, price } = req.body
    const newSpot = await Spot.create({
        address,
        city,
        state,
        country,
        latitude,
        longitude,
        name,
        description,
        price
    })
    res.json(newSpot)
})

// Add an image to a spot based on the spot's id
router.post('/:spotId/images', async(req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findOne({where: {spotId}});
    const { url, preview } = req.body;

    const newImage = await SpotImage.create({
        url,
        preview
    })
    
    res.json(newImage)
})

// Updates and return an existing spot

router.put('/:spotId', async (req, res) => {
     const { address, city, state, country, latitude, longitude, name, description, price } = req.body;
     const spot = await Spot.findByPk(req.params.spotId);
     if(!spot) res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404
    });
     spot.address = address;
     spot.city = city
     spot.state = state
     spot.country = country
     spot.latitude = latitude
     spot.longitude = longitude
     spot.name = name
     spot.description = description
     spot.price = price
     await spot.save()
     res.json(spot)
})

// Delete an Existing Spot
router.delete('/:spotId', async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if(!spot) res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404
    })
    await spot.destroy()
    res.json({
        message: 'Successfully deleted',
        statusCode: 200
    })
})

module.exports = router;


