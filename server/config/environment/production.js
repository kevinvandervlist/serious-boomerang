'use strict';

// Production specific configuration
// =================================
module.exports = {
  logLevel: 'debug',
  logglyEnabled: true,
  logglyTags: ['production'],
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            9090,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
            'mongodb://localhost/seriousboomerang'
  },
  mediaDirectory: '/opt/serious-boomerang/data/'
};
