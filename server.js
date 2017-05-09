const app = require('./server/server');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = app.start();
