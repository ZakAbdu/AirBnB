// backend/utils/validation.js
const { validationResult } = require('express-validator');
const { check } = require('express-validator')

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()
      .map((error) => `${error.msg}`);

    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad request.';
    next(err);
  }
  next();
};

const validateSpot = [
  check('address')
    .notEmpty()
    .withMessage('Street address is required.'),
  check('city')
    .notEmpty()
    .withMessage('City is required.'),
  check('state')
    .notEmpty()
    .withMessage('State is required.'),
  check('country')
    .notEmpty()
    .withMessage('Country is required.'),
  check('lat', "Latitude is not valid.")
    .notEmpty()
    .withMessage('Latitude is not valid.'),
  check('lng', "Longitude is not valid.")
    .notEmpty()
    .withMessage('Longitude is not valid.'),
  check('name')
    .notEmpty()
    .withMessage('Please enter a name.')
    .isLength({max: 49})
    .withMessage('Name must be less than 50 charachters.'),
  check('description')
    .notEmpty()
    .withMessage('Description is required.'),
  check('price')
    .notEmpty()
    .withMessage('Price per day is required.'),
  handleValidationErrors  
];

const validateReview = [
  check('review')
    .notEmpty()
    .withMessage('Review text is required.'),
  check('stars')
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5.'),
  handleValidationErrors
]

const validateBooking = [
  check('startDate')
    .notEmpty()
    .isDate()
    .withMessage('Start date must be a date.'),
  check('endDate')
    .notEmpty()
    .isDate()
    .withMessage('End date must be a date and cannot be on or before startDate.'),
  handleValidationErrors
]

const validateQuery = [

]

module.exports = {
  handleValidationErrors,
  validateSpot,
  validateReview,
  validateBooking,
  validateQuery
};