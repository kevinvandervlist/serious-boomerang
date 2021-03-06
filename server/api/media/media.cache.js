'use strict';

var gm = require('gm');
var FFmpeg = require('fluent-ffmpeg');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var Q = require('q');
var MediaUtils = require('./media.util');

function exists(path) {
  return fs.existsSync(path);
}

function mkdirForFileIfNotExists(destination, deferredResult) {
  var split = destination.split(path.sep);
  split.pop();
  var dir = split.join(path.sep);

  if(!exists(dir)) {
    mkdirp(dir, function (err) {
      if (err) deferredResult.reject(err);
    });
  }
}

function makeWebM(original, destination, x, deferredResult) {
  new FFmpeg({
    source: original
  })
    .withVideoCodec('libvpx')
    .withVideoBitrate('500k')
    .withFps(30)
    .size(x + 'x?')
    .audioCodec('libvorbis')
    .audioBitrate('128k')
    .toFormat('webm')
    .on('error', function (err) {
      deferredResult.reject(err);
    })
    .on('end', function () {
      deferredResult.resolve(destination);
    })
    .saveToFile(destination);
}

function makeH264(original, destination, width, deferredResult) {
  new FFmpeg({
    source: original
  })
    .withVideoCodec('libx264')
    .addOption('-profile:v', 'main')
    .withVideoBitrate('500k')
    .withFps(30)
    .size(width + 'x?')
    .audioCodec('libfdk_aac')
    .audioBitrate('128k')
    .addOption('-movflags', 'faststart')
    .toFormat('mp4')
    .on('error', function (err) {
      deferredResult.reject(err);
    })
    .on('end', function () {
      deferredResult.resolve(destination);
    })
    .saveToFile(destination);

}

function resizeImage(original, destination, format, width, deferredResult) {
  mkdirForFileIfNotExists(destination, deferredResult);

  gm(original)
    .resize(width)
    .autoOrient()
    .write(destination, function (err) {
      if (err) {
        deferredResult.reject(err);
      } else {
        deferredResult.resolve(destination);
      }
    });
}

function resizeVideo(original, destination, format, width, deferredResult) {
  mkdirForFileIfNotExists(destination, deferredResult);
  if(format === 'webm') {
    makeWebM(original, destination, width, deferredResult);
  } else if(format === 'mp4') {
    makeH264(original, destination, width, deferredResult);
  }
}

function handleImageRequest(deferred, format, year, albumName, fileName, size, forceCacheInvalidation) {
  var cached = MediaUtils.cachedPathImage(year, albumName, fileName, size);
  var original = MediaUtils.originalPath(year, albumName, fileName);

  try {
    if(exists(cached) && !forceCacheInvalidation) {
      deferred.resolve(cached);
    } else {
      fs.openSync(cached, 'w');
      resizeImage(original, cached, format, size, deferred);
    }
  } catch(err) {
    deferred.reject(err);
  }
}

function handleVideoRequest(deferred, format, year, albumName, fileName, size, forceCacheInvalidation) {
  var cached = MediaUtils.cachedPathVideo(year, albumName, fileName, size, format);
  var original = MediaUtils.originalPath(year, albumName, fileName);

  try {
    if(exists(cached) && !forceCacheInvalidation) {
      deferred.resolve(cached);
    } else {
      resizeVideo(original, cached, format, size, deferred);
    }
  } catch(err) {
    deferred.reject(err);
  }
}

exports.fromCacheOrGenerate = function (type, format, year, albumName, fileName, size, invalidateCachedEntry) {
  var forceCacheInvalidation = invalidateCachedEntry || false;
  var deferred = Q.defer();

  if(type === 'image') {
    handleImageRequest(deferred, format, year, albumName, fileName, size, forceCacheInvalidation);
  } else if (type === 'video') {
    handleVideoRequest(deferred, format, year, albumName, fileName, size, forceCacheInvalidation);
  } else {
    deferred.reject(new Error('I do not know what to do with type ' + type + '.'));
  }

  return deferred.promise;
};
