//backend/routes/api/spots.js
const express = require('express');
const { handleValidationErrors, validateBooking, validateQuery, validateReview, validateSpot, validateSpotImage } = require('../../utils/validation');
const { setTokenCookie, requireAuth, restoreUser} = require('../../utils/auth');
const { Spot, Review, SpotImage, ReviewImage, User, sequelize } = require('../../db/models');
const { spotExists, spotOwner, convertDate } = require('../../utils/error-handlers.js'); 
const e = require('express');
const router = express.Router();

// Get all Spots
router.get('/', validateQuery, async (req, res) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;


    page = Number(page)
    size = Number(size);
  
    if (!page) page = 1
    if (!size) size = 20
    if (page > 10) page = 10;
    if (size > 20) size = 20;
  
    let pagination = {}
    if (parseInt(page) >= 1 && parseInt(size) >= 1) {
        pagination.limit = size
        pagination.offset = size * (page - 1)
    }
  
    const query = {
      where: {},
      include: [],
      ...pagination
    };
  
    const reviewInclude = {
      model: Review,
      attributes: ['stars']
    };
    query.include.push(reviewInclude);
  
    const imageInclude = {
      model: SpotImage,
      attributes: ['url', 'preview']
    };
  
    query.include.push(imageInclude);
  
    const latWhere = {}
    if (maxLat && !minLat) {
        latWhere.lat = {
        [Op.lte]: maxLat
      }
    } else if (!maxLat && minLat) {
        latWhere.lat = {
          [Op.gte]: minLat
      }
    } else if (maxLat && minLat) {
        latWhere.lat = {
          [Op.and]: {
          [Op.lte]: maxLat,
          [Op.gte]: minLat
      }
    }
  }
  
    if (Object.keys(latWhere).length > 0) {
      query.where = {...query.where, ...latWhere};
    }
  
    const lngWhere = {}
    if (maxLng && !minLng) {
      lngWhere.lng = {
        [Op.lte]: maxLng
      }
    } else if (!maxLng && minLng) {
        lngWhere.lng = {
          [Op.gte]: minLng
      }
    } else if (maxLng && minLng) {
        lngWhere.lng = {
            [Op.and]: {
            [Op.lte]: maxLng,
            [Op.gte]: minLng
      }
    }
  }
  
    if (Object.keys(lngWhere).length > 0) {
      query.where = {...query.where, ...lngWhere};
    }
  
    const priceWhere = {}
    if (maxPrice && !minPrice) {
        priceWhere.price = {
          [Op.lte]: maxPrice
      }
    } else if (!maxPrice && minPrice) {
        priceWhere.price = {
          [Op.gte]: minPrice
      }
    } else if (maxPrice && minPrice) {
        priceWhere.price = {
            [Op.and]: {
            [Op.lte]: maxPrice,
            [Op.gte]: minPrice
      }
    }
  }
  
    if (Object.keys(priceWhere).length > 0) {
      query.where = {...query.where, ...priceWhere};
    }


try {
    const spots = await Spot.findAll(query, {
      include: [Review, SpotImage],
    });
  
    const spotsArr = spots.map((spot) => {
      const spotData = spot.toJSON();
      const { Reviews, SpotImages } = spotData;
  
      let avgRating = "No current ratings";
      if (Reviews.length > 0) {
        const sum = Reviews.reduce((acc, { stars }) => acc + stars, 0);
        avgRating = sum / Reviews.length;
      }
      spotData.avgRating = avgRating;
  
      let previewImage = "No preview image available";
      if (SpotImages.length > 0) {
        const previewImageData = SpotImages.find(({ preview }) => preview);
        if (previewImageData) {
          previewImage = previewImageData.url;
        }
      }
      spotData.previewImage = previewImage;
  
      delete spotData.Reviews;
      delete spotData.SpotImages;
  
      return spotData;
    });
  
    if (!spotsArr.length) {
      res.json("Sorry, no current spots");
    } else {
      res.json({
        Spots: spotsArr,
        page: page,
        size: size,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      title: "Internal server error",
      message: "Something went wrong while fetching spots",
    });
  }
})


// Get all spots owned by the current user
router.get('/current', requireAuth, async (req, res) => {
   const user = req.user;

   const spots = await user.getSpots({
    include: [
        { model: Review, attributes: ['stars'] },
        { model: SpotImage, attributes: ['url', 'preview'] }
    ],
    through: {where: {userId: user.id}}
   })

   const spotsOwned = [];
   spots.forEach(spot => {
    const count = spot.Reviews.length;
    const sum = spot.Reviews.reduce((total, review) => total + review.stars, 0);
    const avgRating = count ? sum / count : "No current ratings";
  
    const eachSpot = {
      ...spot.toJSON(),
      avgRating
    };

    if(eachSpot.SpotImages.length > 0) {
        for(let i = 0; i < eachSpot.SpotImages.length; i++) {
            if(eachSpot.SpotImages[i].preview === true) {
                eachSpot.previewImage = eachSpot.SpotImages[i].url;
            }
        }
    }

    if(!eachSpot.previewImage) {
        eachSpot.previewImage = 'No preview image availble';
    }

    if(!eachSpot.Reviews.length > 0) {
        eachSpot.Reviews = 'No current Reviews'
    }

    if(!eachSpot.SpotImages.length > 0) {
        eachSpot.SpotImages = 'No current SpotImages'
    }

    delete eachSpot.SpotImages;
    delete eachSpot.Reviews;
    spotsOwned.push(eachSpot)
  });

  if (spotsOwned.length === 0) {
    res.json('Sorry, no spots found.')
  }

  res.json({
    Spots: spotsOwned
  })
})

// Get details of a spot from an id
router.get('/:spotId', spotExists, async(req, res) => {
    const spotId = req.params.spotId;

    let spot;
    try {
        spot = await Spot.findByPk(spotId);
        spot = spot.toJSON();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

    let count;
    try {
        count = await Review.count({
            where: { spotId: spotId }
        })
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
    spot.numReviews = count;

    let sum;
    try {
        sum = await Review.sum('stars', {
            where: {spotId: spotId}
        })
    } catch (error) {
        return res.status(400).json({message: error.message});
    }

    if(sum / count) {
        spot.avgStarRating = sum / count;
    } else {
      spot.avgStarRating = 'No current ratings.';
    }

    let SpotImages;
    try {
      SpotImages = await SpotImage.findAll({
        where: {spotId: spotId}, attributes: ['id', 'url', 'preview']
      })
    } catch (error) {
      return res.status(400).json({message: error.message});
    }

    if(SpotImages.length > 0) {
      spot.SpotImages = SpotImages;
    } else {
      spot.SpotImages = "No images listed"
    }

    let owner;
    try {
      owner = await User.findByPk(spot.ownerId, {
        attributes: ['id', 'firstName', 'lastName']
      })
    } catch (error) {
      return res.status(400).json({message: error.message});
  }

  spot.Owner = owner

  return res.json(spot)

})

// Create a spot
router.post('/', requireAuth, validateSpot, async(req, res) => {
  const user = req.user;
  const {address, city, state, country, lat, lng, name, description, price } = req.body;
  const newSpot = await Spot.create({
    ownerId: user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  })
  res.status = 201;
  return res.json(newSpot);
})

// Add an image to a spot based on the spot's id
router.post('/:spotId/images', requireAuth, spotExists, spotOwner, validateSpotImage, async(req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    const { url, preview } = req.body;

    const newImage = await spot.createSpotImage({
        url: url,
        preview: preview
    })
    
    res.json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview
    })
})


// Edit a Spot
router.put('/:spotId', requireAuth, spotExists, spotOwner, validateSpot, async (req, res) => {

     const { address, city, state, country, lat, lng, name, description, price } = req.body;
     const spot = await Spot.findByPk(req.params.spotId);
   
     spot.address = address;
     spot.city = city
     spot.state = state
     spot.country = country
     spot.lat = lat
     spot.lng = lng
     spot.name = name
     spot.description = description
     spot.price = price
     await spot.save()
     res.json(spot)
})

// Delete an Existing Spot
router.delete('/:spotId', requireAuth, spotExists, spotOwner, async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    spot.destroy()
    res.json({
        message: 'Successfully deleted',
        statusCode: 200
    })
})

// Get all reviews by a spots id
router.get('/:spotId/reviews', spotExists, async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    const reviews = await spot.getReviews({
      include: [
        {model: User, attributes: ['id', 'firstName', 'lastName']},
        {model: ReviewImage, attributes: ['id', 'url']}
      ]
    })
    const reviewsArr = [];
    reviews.forEach(review => {
      const eachReview = review.toJSON();
      if(!eachReview.ReviewImages.length > 0) {
      eachReview.ReviewImages = "No review available"
    }
    reviewsArr.push(eachReview);
    if(!reviewsArr.length) {
      return res.json("Current spot has no reviews.")
    }
    res.json({
      Reviews: reviewsArr
     })
   })
})

// Create a review for a spot based on the spots id
router.post('/:spotId/reviews', requireAuth, spotExists, validateReview, async(req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId)
    const user = req.user;
    const { review, stars } = req.body;

    const existingReview = await Review.findOne({
      where: {spotId: spotId, userId: user.id}
    })

    if(existingReview) {
      return res.status(403).json({
        message: 'User already has a review for this spot.',
        statusCode: 403
      })
    }

    if(spot.ownerId === user.id) {
      return res.status(403).json({
        message: 'User cannot leave a review on own spot.',
        statusCode: 403
      })
    }

    const newReview = await spot.createReview({
      userId: user.id,
      review: review,
      stars: stars
    });
    res.json(newReview);
})

// Get all bookings based on spots id
router.get('/:spotId/bookings', requireAuth, spotExists, async(req, res) => {
  const user = req.user;
  const spot = await Spot.findByPk(req.params.spotId);

  const bookings = await spot.getBookings({
    include: {model: User, attributes: ['id', 'firstName', 'lastName']}
  })

  if(!bookings.length > 0) {
    return res.json({
      message: 'No bookings for current spot.'
    })
  }

  const bookingArr = [];
  bookings.forEach(booking => {
    booking = booking.toJSON();
    const eachBooking = bookingObject(booking, user, spot);
    bookingArr.push(eachBooking);
  })
  res.json({
    Bookings: bookingArr
  })
})

function bookingObject(booking, user, spot) {
  if (user.id !== spot.ownerId) {
      return {
          spotId: booking.spotId,
          startDate: booking.startDate,
          endDate: booking.endDate
      };
  } else {
      return {
          User: booking.User,
          id: booking.id,
          spotId: booking.spotId,
          userId: booking.userId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
      };
  }
}

// Create a booking from a spot based on Spots id
 router.post('/:spotId/bookings', requireAuth, spotExists, validateBooking, async (req, res, next) => {
    const { spotId } = req.params;
    const user = req.user;
    let { startDate, endDate } = req.body;
    startDate = convertDate(startDate);
    endDate = convertDate(endDate);
  
    try {
      await validateBookingRequest(startDate, endDate, user, spotId);
      const newBooking = await createBooking(spotId, user.id, startDate, endDate);
      return res.json(newBooking);
    } catch (error) {
      return next(error);
    }
  });
  
  const validateBookingRequest = async (startDate, endDate, user, spotId) => {
    // Check if start date is in the past
    if (startDate <= new Date()) {
      throw {
        title: "Can't make a booking in the past",
        statusCode: 403,
        message: "Start date cannot be before today's date"
      };
    }
  
    // Check if end date is before or on start date
    if (endDate <= startDate) {
      throw {
        message: "Validation error",
        statusCode: 400,
        errors: {
           endDate: "End date cannot be on or before start Date"
        }
      };
    }
  
    // Check if user is the owner of the spot
    const spot = await Spot.findByPk(spotId);
    if (user.id === spot.ownerId) {
      throw {
        message: "Owner can't make booking for owned spot",
        status: 403
      };
    }
  
    // Check for conflicting bookings
    const bookings = await spot.getBookings();
    const bookingConflict = checkBookingConflict(startDate, endDate, bookings);
    if (bookingConflict) {
      throw bookingConflict;
    }
  };
  
  const createBooking = async (spotId, userId, startDate, endDate) => {
    const spot = await Spot.findByPk(spotId);
    const newBooking = await spot.createBooking({
      userId,
      startDate,
      endDate
    });
    return newBooking;
  };
  
  const checkBookingConflict = (startDate, endDate, bookings) => {
    for (let i = 0; i < bookings.length; i++) {
      const bookedStartDate = convertDate(bookings[i].startDate);
      const bookedEndDate = convertDate(bookings[i].endDate);
  
      if ((bookedStartDate <= startDate && bookedEndDate >= startDate) ||
        (bookedStartDate <= endDate && endDate <= bookedEndDate) ||
        (bookedStartDate >= startDate && bookedEndDate <= endDate)) {
        return {
          message: "Sorry, this spot is already booked for the specified dates",
          statusCode: 403,
          errors: [
            { startDate: "Start date conflicts with an existing booking" },
            { endDate: "End date conflicts with an existing booking" }
          ]
        };
      }
    }
    return null;
  };


module.exports = router;


