'use strict';

var Album = require('../album/album.model');
var Media = require('./media.model');
var passport = require('passport');
var config = require('../../config/environment');
var modelUtils = require('../../util/ModelUtils');
var MediaCache = require('./media.cache');
var Q = require('q');

/**
 * Get list of media that's associated with the requested album
 */
exports.index = function (req, res) {
  var albumId = req.params.albumId;
  Media.find({
    albumId: albumId
  }, function (err, medialist) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(medialist);
    }
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
    res.status(200).json(value)
  }, function(err) {
    res.status(404).send(err);
  });
};

/**
 * Retrieve a single media file.
 * @param req
 * @param res
 */
exports.getSingleFile = function (req, res) {
  var fail = function(err) {
    res.status(500).send(err);
  };

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

      var pathPromise = MediaCache.fromCacheOrGenerate(media.mediaType, req.params.format, year, album.name, fileName, req.params.size);
      pathPromise.then(function(path) {
        res.sendFile(path, function(err) {
          if (err) {
            next(err);
          }
        });
      }, fail);
    }, fail);
};

exports.deleteSingleFile = function (req, res) {
  modelUtils.getAsPromiseOne(Media, {
    _id: req.params.mediaId,
    albumId: req.params.albumId
  }).then(function(media) {
    media.remove(function(err) {
      if(err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(media)
      }
    });
  }, function(err) {
    res.status(404).send(err);
  });
};