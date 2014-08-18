'use strict';

// Development specific configuration
// ==================================
module.exports = {
  logLevel: 'debug',
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/seriousboomerang-dev'
  },
  mediaDirectory: '/opt/serious-boomerang/data/'
};
