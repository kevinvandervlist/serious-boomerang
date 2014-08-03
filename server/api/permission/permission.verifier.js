'use strict';

var AlbumPermission = require('./album.permission.model');
var Album = require('../album/album.model');
var Media = require('../media/media.model');
var User = require('../user/user.model');
var passport = require('passport');
var config = require('../../config/environment');
var Q = require('q');
var rx = require('rx');

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

function userHasPermissionForAlbum(userId, albumId, deferred) {
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
}

exports.accessGranted = function() {
  var deferred = Q.defer();
  deferred.resolve(access());
  return deferred.promise;
};

exports.accessDenied = function() {
  var deferred = Q.defer();
  deferred.resolve(denied());
  return deferred.promise;
};

exports.allowedAlbumIdsByUserId = function(userId) {
  var deferred = Q.defer();
  var result = [];

  rx.Observable
    .fromPromise(AlbumPermission.find({referencedUserId: userId}).exec())
    .flatMap(rx.Observable.fromArray)
    .map(function(permission) {
      return permission.appliedAlbumId;
    })
    .subscribe(function(id) {
      result.push(id.toString());
    }, function(err) {
      deferred.reject(err);
    }, function() {
      deferred.resolve(result);
    });

  return deferred.promise;
};

exports.userHasPermissionForAlbum = function(userId, albumId) {
  var deferred = Q.defer();

  userHasPermissionForAlbum(userId, albumId, deferred);

  return deferred.promise;
};

exports.userHasPermissionForMedia = function(userId, mediaId) {
  var deferred = Q.defer();

  var mediaPromise = Media.findById(mediaId).exec();
  mediaPromise.then(function(media) {
    if(media) {
      userHasPermissionForAlbum(userId, media.albumId, deferred);
    } else {
      deferred.reject(new Error('No media file found for id ' + mediaId));
    }
  }, function(err) {
    deferred.reject(err);
  });

  return deferred.promise;
};
