const express = require('express');
const passport = require('passport');
const Tags = require('../controllers/tags');

const requireAuth = passport.authenticate('jwt', { session: false });

const router = express.Router();

router.route('/')
  .all(requireAuth)
  .get(Tags.list)
  .post(Tags.create);
router.route('/:tagId')
  .all(requireAuth)
  .get(Tags.read)
  .put(Tags.update)
  .delete(Tags.delete);
router.route('/:tagId/notes')
  .get(Tags.notesByTag);
// Finish by binding the tag middleware
router.param('tagId', Tags.tagById);

module.exports = router;
