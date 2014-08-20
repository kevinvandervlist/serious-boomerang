'use strict';

// Test specific configuration
// ===========================
module.exports = {
  logLevel: 'debug',
  logglyEnabled: false,
  logglyTags: ['test'],
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/seriousboomerang-test'
  },
  seedDB: false,
  mediaDirectory: '/opt/serious-boomerang/data/'
};
