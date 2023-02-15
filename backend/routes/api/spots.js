//backend/routes/api/spots.js
const express = require('express');
const { check } = require('express-validator');
const { Spot } = require('../../db/models');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

router = express.Router();


