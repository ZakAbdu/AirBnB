//backend/routes/api/bookings.js
const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth, restoreUser} = require('../../utils/auth');
const { Spot, Review, SpotImage, Booking, User, sequelize } = require('../../db/models');
const router = express.Router();

router.get('/current', async(req, res) => {
    const bookings = await Booking.findAll({
        include: [
            {model: Spot}
        ]
    })
    res.json(bookings);
})



module.exports = router;