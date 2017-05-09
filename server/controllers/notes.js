const db = require('../models');

const Note = db.note;
const Tag = db.tag;

const updateTags = (origNote, tags, res) => {
  const noteId = origNote.id;
  // this will remove any existing tags not specified in tags array, so be careful...
  origNote.setTags(tags, {
    // logging: console.log
  })
    .then((data) => {
      // tags were added to note, retrieve the note again to get everything
      Note.findById(noteId, {
        include: [
          {
            model: Tag
          }
        ],
        // logging: console.log,
        order: [[Tag, 'name']]
      })
        .then((note) => {
          res.json(note);
        })
        .catch((err) => {
          console.log('error:', err.message);
          res.json(origNote);
        });
    })
    .catch((err) => {
      console.log('error message: ', err.message);
      // failed setting tags, but note was updated, so return it
      res.json(origNote);
    });
};

module.exports.list = (req, res) => {
  const userId = req.query.userId;
  const queryParams = {
    include: [
      {
        model: Tag
      }
    ],
    // logging: console.log,
    order: [['updatedAt', 'DESC'], [Tag, 'name']]
  };
  if (userId) {
    queryParams.where = {
      userId
    };
  }

  Note.findAll(queryParams)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.read = (req, res) => {
  res.json(req.note);
};

module.exports.create = (req, res) => {
  // Create the note and assign it to the current user
  const text = req.body.text;
  const tags = req.body.tags; // should be an array of tag id's or null

  Note
    .create({
      text,
      userId: req.user.id
    }, {
      // logging: console.log
    })
    .then((newNote) => {
      if (tags) {
        updateTags(newNote, tags, res);
      } else {
        res.json(newNote);
      }
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
};

module.exports.update = (req, res) => {
  const note = req.note;
  const tags = req.body.tags;

  note.updateAttributes(req.body)
    .then((updatedNote) => {
      if (tags) {
        updateTags(updatedNote, tags, res);
      } else {
        res.json(updatedNote);
      }
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
};

module.exports.delete = (req, res) => {
  const note = req.note;
  note.destroy()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
};

module.exports.tagsByNote = (req, res) => {
  const note = req.note;

  Tag.findAll({
    include: [
      {
        model: Note,
        through: {
          where: {
            noteId: note.id
          }
        },
        required: true   // make sure do to an INNER JOIN instead of an OUTER JOIN so we don't get empties
      }
    ],
    order: 'name'
    // logging: console.log
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
};

// Middleware to retrieve the note when an id is passed in the route
module.exports.noteById = function (req, res, next, id) {
  Note.findById(id, {
    include: [
      {
        model: Tag
      }
    ],
    // logging: console.log,
    order: [[Tag, 'name']]
  })
    .then((note) => {
      if (!note) {
        const err = new Error(`failed to load note: ${id}`);
        err.status = 404;
        return next(err);
      }
      req.note = note;
      next();
    })
    .catch((err) => {
      return next(err);
    });
};

