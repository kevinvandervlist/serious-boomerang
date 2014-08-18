/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var winston = require('winston');
var Loggly = require('winston-loggly').Loggly;
var secrets = require('./config/local.env');

var loggly_options = {
  subdomain: secrets.LOGGLY_SUBDOMAIN,
  inputToken: secrets.LOGGLY_INPUT_TOKEN,
  tags: ['serious-boomerang', 'NodeJS'],
  json: true,
  level: config.logLevel
};
winston.add(Loggly, loggly_options);
//winston.add(winston.transports.File, { filename: "../logs/production.log" });
module.exports=winston;

winston.addColors({
  debug: 'green',
  info:  'cyan',
  silly: 'magenta',
  warn:  'yellow',
  error: 'red'
});

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  level: config.logLevel,
  colorize:true,
  json: true
});

winston.info('Starting up at ' + new Date());

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;