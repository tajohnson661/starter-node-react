const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

const User = db.user;

const comparePassword = (candidatePassword, userModelPassword, callback) => {
  bcrypt.compare(candidatePassword, userModelPassword, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

module.exports.init = () => {
  // Create local (username,password) strategy.
  // This strategy is used only when the user is trying to log in.
  const localOptions = {
    usernameField: 'email' // use the email property of the data sent in as passport's user name
    // password will be found by default using the password property of the data sent in
  };
  const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    // Verify the email and password and call 'done' with the user
    // if not ok, call 'done' with false
    User.findOne({
      where: {
        email
      }
    })
      .then((user) => {
        if (!user) {
          return done(null, false);
        }
        comparePassword(password, user.password, (err, isMatch) => {
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false);
          }
          // when passing back user, passport sets this to req.user
          return done(null, user);
        });
      })
      .catch((err) => {
        console.error('unable to read file, because: ', err);
        return done(err);
      });
  });

  // We use a jwt strategy when the user is already logged in, and we're just checking to
  // make sure they're actually logged in.
  // Set up options for Jwt strategy

  const secret = process.env.APP_SECRET;
  if (!secret) {
    throw new Error('APP_SECRET not set');
  }

  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),  // where we get the jwt from
    secretOrKey: secret
  };

  // Create a passport strategy based on JWT
  const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    // See if the UserID in the payload exists in our database
    // If it does, call 'done' with that user.
    // Otherwise, call 'done' without a user object

    User.findOne({
      where: {
        id: payload.sub
      }
    })
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((err) => {
        (done(err, false));
      });
  });

  // Tell passport to use these strategies
  passport.use(jwtLogin);
  passport.use(localLogin);
};
