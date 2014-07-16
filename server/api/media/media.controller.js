'use strict';

var Media = require('./media.model');
var passport = require('passport');
var config = require('../../config/environment');

/**
 * Get list of media that's associated with the requested album
 */
exports.index = function (req, res) {
  var albumId = req.params.albumId;

  Media.find({
    albumId: albumId
  }, function (err, medialist) {
    if (err) return res.send(500, err);
    res.json(200, medialist);
  });
};

/**
 * Retrieve a single media file.
 * @param req
 * @param res
 */
exports.singleFile = function(req, res) {
  var albumId = req.params.albumId;
  var mediaId = req.params.mediaId;
};