'use strict';

var Album = require('./album.model');
var passport = require('passport');
var config = require('../../config/environment');
var PermissionVerifier = require('../permission/permission.verifier');
var ModelUtils = require('../../util/ModelUtils');

/**
 * Get list of allowed albums
 */
exports.index = function (req, res) {
  var ids = PermissionVerifier.allowedAlbumIdsByUserId(req.user._id);
  ids.then(function(allowedIds) {
    return Album.find({})
      .where('_id').in(allowedIds)
      .exec();
  }).then(function(albums) {
    res.json(200, albums);
  }, function(err) {
    return res.send(500, err);
  });
};

/**
 * Get list of albums
 */
exports.all = function (req, res) {
  Album
    .find({})
    .exec()
    .then(function(albums) {
      res.json(200, albums);
    }, function(err) {
      return res.send(500, err);
    });
};

/**
 * Get the details of an album.
 */
exports.albumDetailsByYearName = function (req, res) {
  var year = req.params.year;
  var name = req.params.name;

  var ids = PermissionVerifier.allowedAlbumIdsByUserId(req.user._id);
  var start = new Date(year, 0, 1);
  var end = new Date(year, 11, 31);

  return ids.then(function (allowedIds) {
    return ModelUtils.getAsPromiseOne(Album, {
      name: name,
      _id: {
        $in: allowedIds
      },
      startDate: {
        $gte: start,
        $lt: end
      }
    });
  }).then(function(album) {
      if (!album) return res.send(401);
      res.json(album);
    }, function(err) {
      return res.send(500, err);
    });
};

exports.createNewAlbum = function(req, res) {
  function error(err) {
    return res.json(422, err);
  }

  var album = new Album({
    name: req.body.name,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  });

  album.save(function(err) {
    if(err) {
      return error(err);
    } else {
      console.log(album);
      res.send(201);
    }
  });
};