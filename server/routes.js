const passport = require('passport');
const passportService = require('./services/passport');
const NotesRoutes = require('./routes/notes-routes');
const TagsRoutes = require('./routes/tags-routes');
const AuthRoutes = require('./routes/auth-routes');
const UsersRoutes = require('./routes/users-routes');

const requireAuth = passport.authenticate('jwt', { session: false });

module.exports.init = (app) => {
  passportService.init();

  // Api entity routes
  app.use('/api/notes', NotesRoutes);
  app.use('/api/tags', TagsRoutes);
  app.use('/api/auth', AuthRoutes);
  app.use('/api/users', UsersRoutes);

  // Some testing routes for authentication
  app.use('/secured', requireAuth);
  app.get('/ping', (req, res) => {
    res.status(200).send('Server is alive...');
  });
  app.get('/secured/ping', (req, res) => {
    res.status(200).send('All good. You only get this message if you\'re authenticated');
  });
};
