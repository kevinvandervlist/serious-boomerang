'use strict';

var passport = require('passport');
var config = require('../../config/environment');
var AlbumPermission = require('./album.permission.model');


exports.allAlbumPermissions = function (req, res) {
  AlbumPermission
    .find({})
    .exec()
    .then(function(permissions) {
      res.json(200, permissions)
    }, function(err) {
      res.send(500, err);
    });
};

exports.addAlbumPermission = function (req, res) {
  var perm = new AlbumPermission(req.body);
  perm.save(function(err) {
    if(err) {
      res.send(500, err);
    } else {
      res.send(200);
    }
  });
};

exports.deleteAlbumPermission = function (req, res) {
  AlbumPermission
    .findOneAndRemove({
      appliedAlbumId: req.params.albumId,
      referencedUserId: req.params.userId
    })
    .exec()
    .then(function(permission) {
      res.send(200, permission)
    }, function(err) {
      res.send(500, err);
    });
};
