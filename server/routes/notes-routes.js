const express = require('express');
const passport = require('passport');
const Notes = require('../controllers/notes');

const requireAuth = passport.authenticate('jwt', { session: false });

const router = express.Router();

router.route('/')
  .all(requireAuth)
  .get(Notes.list)
  .post(Notes.create);
router.route('/:noteId')
  .all(requireAuth)
  .get(Notes.read)
  .put(Notes.update)
  .delete(Notes.delete);
router.route('/:noteId/tags')
  .get(Notes.tagsByNote);
// Finish by binding the note middleware
router.param('noteId', Notes.noteById);

module.exports = router;
