// backend/routes/api/users.js
const express = require('express')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
    check('firstName')
      .exists({checkFalsy: true})
      .withMessage('First name cannot be empty.')
      .isLength({max: 30})
      .withMessage('First name must be in between 1-30 charachters.')
      .isAlpha()
      .withMessage('Please provide a valid first name. Letters only.'),
    check('lastName')
      .exists({checkFalsy: true})
      .withMessage('Last name cannot be empty.')
      .isLength({max: 30})
      .withMessage('Last name must be in between 1-30 charachters')
      .isAlpha()
      .withMessage('Please provide a valid last name. Letters only'),
    check('email')
      .exists({ checkFalsy: true })
      .withMessage('Email field cannot be empty.')
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .withMessage('Username field cannot be empty')
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Password field cannot be empty.')
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];


// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;
      const user = await User.signup({ firstName, lastName, email, username, password });
  
      await setTokenCookie(res, user);
  
      return res.json({
        user,
      });
    }
  );

  
module.exports = router;