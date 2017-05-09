const jwt = require('jwt-simple');
const db = require('../models');

const User = db.user;

const getTimeout = () => {
  const defaultTimeout = 60 * 60; // 1 hour
  const tokenTimeout = parseInt(process.env.TOKEN_TIMEOUT, 10);

  if (isNaN(tokenTimeout)) {
    return defaultTimeout;
  }
  return tokenTimeout;
};

function tokenForUser(user) {
  const secret = process.env.APP_SECRET;
  const timestamp = Math.floor(Date.now() / 1000); // in seconds
  const exp = timestamp + getTimeout(); // Note: timed out requests return a 401
  console.log('Token timeout is set to: ', getTimeout());
  return jwt.encode({ sub: user.id, iat: timestamp, exp }, secret);
}

module.exports.signin = function (req, res, next) {
  // user has already had their username/password authorized via middleware on the route.
  // We just need to give them a token and the user data
  // passport has set user object to req.user
  res.send({ token: tokenForUser(req.user), user: req.user });
};

module.exports.signup = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'No email or password provided' });
  }

  // See if user with email exists
  User.findOne({
    where: { email }
  })
    .then((user) => {
      if (user) {
        return res.status(422).send({ error: 'Email already exists' });
      }
      // No error, but couldn't find the user.  Continue on
      // If not exist, create and save the user record
      User.create({ email, password })
        .then((user) => {
          // Respond to request indicate user was created, give them back a JWT (json web token)
          // User ID + a secret string = JSON Web token
          res.json({ token: tokenForUser(user), user });
        })
        .catch((err) => {
          console.log('err on user create', err);
          res.status(422).send({ error: err.message });
        });
    })
    .catch((err) => {
      console.log('err on findOne', err);
      res.status(422).send({ error: err.message });
    });
};
