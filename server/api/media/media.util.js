'use strict';

var config = require('../../config/environment');
var Album = require('../album/album.model');
var Media = require('./media.model');
var passport = require('passport');
var Q = require('q');

function getExtension(fileName) {
  return fileName.split('.').pop();
}

exports.originalPath = function (year, albumName, fileName) {
  return config.mediaDirectory + '/media/' + year + '/' + albumName + '/' + fileName;
};

exports.cachedPathImage = function(year, albumName, fileName, size) {
  var split = fileName.split('.');
  var ext = split.pop();
  var file = split.join('.');
  return config.mediaDirectory + '/cache/' + year + '/' + albumName + '/' + file + '_' + size + '.' + ext;
};

exports.cachedPathVideo = function(year, albumName, fileName, size, format) {
  var split = fileName.split('.');
  split.pop();
  var file = split.join('.');
  return config.mediaDirectory + '/cache/' + year + '/' + albumName + '/' + file + '_' + size + '.' + format;
};

/**
 * Add a media file to an album
 * @return A deferred path in which the asset must be placed.
 */
exports.addMediaToImage = function(year, name, fileName, allowed_image_exts, allowed_video_exts) {
  var deferred = Q.defer();

  var async = Q.defer();
  async.resolve(fileName);
  async.promise.then(function(fileName) {
    return getExtension(fileName);
  }).then(function(ext) {
    var allowed_exts = allowed_video_exts.concat(allowed_image_exts);
    if(allowed_exts.indexOf(ext) === -1) {
      deferred.reject('');
    }
    return ext;
  }).then(function() {
    //return AlbumUtils.getAlbumByYearName(year, name)
    return {};
  }).then(function(album) {
    var type = '';
    var timestamp = '';

    if(allowed_image_exts.indexOf(getExtension(fileName)) !== -1) {
      type = 'image';
      timestamp = new Date(); // TODO: Extract from exif
    } else {
      type = 'video';
      timestamp = new Date();
    }

    return new Media({
      albumId: album._id,
      name: fileName,
      addedOn: new Date(),
      timestamp: timestamp,
      mediaType: type
    });
  }).then(function(media) {
    media.save(function(err) {
      if(err) {
        deferred.reject(err);
      } else {
        deferred.resolve(exports.originalPath(year, name, fileName));
      }
    });
  });

  return deferred.promise;
};