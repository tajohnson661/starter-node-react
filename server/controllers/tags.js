const db = require('../models');

const Tag = db.tag;
const Note = db.note;

module.exports.list = (req, res) => {
  Tag.findAll({ order: 'name' })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.read = (req, res) => {
  res.json(req.tag);
};

module.exports.create = (req, res) => {
  const name = req.body.name;
  Tag.create({
    name
  })
    .then((newTag) => {
      res.json(newTag);
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.update = (req, res) => {
  const tag = req.tag;

  tag.updateAttributes(req.body)
    .then((updatedTag) => {
      res.json(updatedTag);
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.delete = (req, res) => {
  const tag = req.tag;
  tag.destroy()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.notesByTag = (req, res) => {
  const tag = req.tag;

  Note.findAll({
    include: [
      {
        model: Tag,
        through: {
          where: {
            tagId: tag.id
          }
        },
        required: true
      }
    ],
    order: [['updatedAt', 'DESC']]
    // logging: console.log
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log('error: ', err.message);
      res.json(err);
    });
};


// Middleware to retrieve the tag when an id is passed in the route
module.exports.tagById = function (req, res, next, id) {
  Tag.findById(id)
    .then((tag) => {
      if (!tag) {
        const err = new Error(`failed to load tag: ${id}`);
        err.status = 404;
        return next(err);
      }
      req.tag = tag;
      next();
    })
    .catch((err) => {
      return next(err);
    });
};

