'use strict';

var AlbumPermission = require('./album.permission.model');
var Album = require('../album/album.model');
var User = require('../user/user.model');
var passport = require('passport');
var config = require('../../config/environment');
var Q = require('q');

function access() {
  return {
    access: true
  };
}

function denied() {
  return {
    access: false
  };
}

exports.userHasPermissionForAlbum = function(userId, albumId) {
  var deferred = Q.defer();

  AlbumPermission.findOne({
    appliedAlbumId: albumId,
    referencedUserId: userId
  }, function (err, permission) {
    if (err) {
      deferred.reject(err);
    }
    if(permission) {
      deferred.resolve(access());
    } else {
      deferred.resolve(denied());
    }
  });

  return deferred.promise;
};
