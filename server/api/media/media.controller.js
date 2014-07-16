'use strict';

var Media = require('./media.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function (res, err) {
  return res.json(422, err);
};

/**
 * Get list of media that's associated with the requested album
 */
exports.index = function (req, res) {
  var albumId = req.params.albumId;

  Media.find({}, function (err, medialist) {
    if (err) return res.send(500, err);
    res.json(200, medialist);
  });
};
