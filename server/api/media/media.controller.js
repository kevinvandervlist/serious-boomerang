'use strict';

var Album = require('../album/album.model');
var Media = require('./media.model');
var passport = require('passport');
var config = require('../../config/environment');
var modelUtils = require('../../util/ModelUtils');

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
 * Describe a single file
 * @param req
 * @param res
 */
exports.describeSingleFile = function (req, res) {
  modelUtils.getAsPromiseOne(Media, {
    _id: req.params.mediaId,
    albumId: req.params.albumId
  }).then(function(value) {
    res.json(200, value);
  });
};

/**
 * Retrieve a single media file.
 * @param req
 * @param res
 */
exports.getSingleFile = function (req, res) {
  var albumPromise = modelUtils
    .getAsPromiseOne(Album, {
      _id: req.params.albumId
    });

  var mediaPromise = modelUtils
    .getAsPromiseOne(Media, {
      _id: req.params.mediaId,
      albumId: req.params.albumId
    });

  modelUtils
    .waitForCompletion(albumPromise, mediaPromise)
    .then(function (result) {
      var album = result[0];
      var media = result[1];

      var year = new Date(album.startDate).getFullYear();
      var fileName = media.name;
      var path = config.mediaDirectory + '/media/' + year + '/' + album.name + '/' + fileName;
      res.sendFile(path, function(err) {
        if (err) return res.send(500, err);
      });
    });
};
