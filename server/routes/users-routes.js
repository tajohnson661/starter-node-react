const express = require('express');
const passport = require('passport');
const Users = require('../controllers/users');

const requireAuth = passport.authenticate('jwt', { session: false });

const router = express.Router();

router.route('/me')
  .all(requireAuth)
  .get(Users.me);

module.exports = router;
