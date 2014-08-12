/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/album', require('./api/album'));
  app.use('/api/media', require('./api/media'));
  app.use('/api/comment', require('./api/comment'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/permission/', require('./api/permission'));
  app.use('/api/upload', require('./api/upload'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
