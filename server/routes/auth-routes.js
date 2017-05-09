const express = require('express');
const passport = require('passport');
const Authentication = require('../controllers/authentication');

const requireSignin = passport.authenticate('local', { session: false });

const router = express.Router();

router.route('/signup')
  .post(Authentication.signup);
router.route('/signin')
  .post(requireSignin, Authentication.signin);

module.exports = router;
