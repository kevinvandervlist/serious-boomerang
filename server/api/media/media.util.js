'use strict';

var config = require('../../config/environment');
var Album = require('../album/album.model');
var Media = require('./media.model');
var passport = require('passport');
var Q = require('q');
var ExifImage = require('exif').ExifImage;

var image_exts = config.imageExtensions;
var video_exts = config.videoExtensions;
var allowed_exts = video_exts.concat(image_exts);

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
exports.addMediaToImage = function(albumId, fileName, curPath) {
  var deferred = Q.defer();

  var async = Q.defer();

  async.resolve(fileName);
  async.promise.then(function(fileName) {
    return getExtension(fileName);
  }).then(function(ext) {
    if(allowed_exts.indexOf(ext) === -1) {
      deferred.reject('');
    }
    return ext;
  }).then(function() {
    var async = Q.defer();

    var data = {
      type: undefined,
      timestamp:undefined
    };

    if(image_exts.indexOf(getExtension(fileName)) !== -1) {
      new ExifImage({ image : curPath }, function(err, exifdata) {
        if(err) {
          async.reject(err);
        }
        var split = exifdata.exif.CreateDate.split(/:| /);
        data.timestamp = new Date(split[0], split[1] - 1, split[2]);
        async.resolve(data);
      });
      data.type = 'image';
    } else {
      data.type = 'video';
      data.timestamp = new Date();
      async.resolve(data);
    }

    return async.promise;
  }).then(function(data) {
    return new Media({
      albumId: albumId,
      name: fileName,
      addedOn: new Date(),
      timestamp: data.timestamp,
      mediaType: data.type
    });
  }).then(function(media) {
    Album
      .findById(albumId)
      .exec()
      .then(function(album) {
        media.save(function(err) {
          if(err) {
            deferred.reject(err);
          } else {
            deferred.resolve(exports.originalPath(album.year, album.name, fileName));
          }
        });
      }, function(err) {
        deferred.reject(err);
      });
  });

  return deferred.promise;
};