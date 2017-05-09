const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config({ path: path.resolve(__dirname, './config/.env') });
const cors = require('cors');
const http = require('http');
const jsyaml = require('js-yaml');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

const routes = require('./routes');
const db = require('./models');

module.exports.start = () => {
  const app = express();

  // Various middleware
  app.use(cors());
  if (process.env.NODE_ENV === 'test') {
    app.use(logger(() => {
      return null;
    }));
  } else {
    app.use(logger('dev'));
  }
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Test database connection
  db.sequelize
    .authenticate()
    .then(() => {
      console.log('Database connection to database has been established successfully.');
    })
    .catch((err) => {
      console.log('Database connection failed');
      process.exit(1);
    });

  // For testing db models only.  This can't be here since we use migrations.
  // db.sequelize.sync({ force: true });

  // Set up all of our routes
  routes.init(app);

  // Initialize the Swagger middleware and swagger document
  const spec = fs.readFileSync(path.resolve(__dirname, './api/swagger.yaml'), 'utf8');
  const swaggerDoc = jsyaml.safeLoad(spec);
  // swaggerDoc.host = 'https://ourhostname.com';
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  // Express only serves static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
  }

  // Get port from environment and store in Express.
  const port = normalizePort(process.env.PORT || '3001');
  app.set('port', port);

  // Didn't find route... catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler - last of the middleware, nothing else handled it
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // send back error
    const errStatus = err.status || 500;
    res.status(errStatus);
    res.json({
      error: errStatus.toString()
    });
  });

  // Create HTTP server.
  const server = http.createServer(app);

  // Listen on provided port, on all network interfaces.
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  return app;

  // Normalize a port into a number, string, or false.
  function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  // Event listener for HTTP server "error" event.
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  // Event listener for HTTP server "listening" event.
  function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
  }
};

