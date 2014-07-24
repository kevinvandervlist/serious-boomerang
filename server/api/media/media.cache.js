'use strict';

var config = require('../../config/environment');
var gm = require('gm');
var FFmpeg = require('fluent-ffmpeg');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var Q = require('q');

function originalPath(year, albumName, fileName) {
  return config.mediaDirectory + '/media/' + year + '/' + albumName + '/' + fileName;
}

function cachedPathImage(year, albumName, fileName, size) {
  var split = fileName.split('.');
  var ext = split.pop();
  var file = split.join('.');
  return config.mediaDirectory + '/cache/' + year + '/' + albumName + '/' + file + '_' + size + '.' + ext;
}

function cachedPathVideo(year, albumName, fileName, size) {
  var split = fileName.split('.');
  var ext = 'webm';
  split.pop();
  var file = split.join('.');
  return config.mediaDirectory + '/cache/' + year + '/' + albumName + '/' + file + '_' + size + '.' + ext;
}

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

function resizeImage(original, destination, x, deferredResult) {
  mkdirForFileIfNotExists(destination, defferedResult);

  gm(original)
    .resize(x)
    .autoOrient()
    .write(destination, function (err) {
      if (err) {
        deferredResult.reject(err);
      } else {
        deferredResult.resolve(destination);
      }
    });
}

function resizeVideo(original, destination, x, deferredResult) {
  mkdirForFileIfNotExists(destination, deferredResult);
  makeWebM(original, destination, x, deferredResult);
}

function handleImageRequest(deferred, year, albumName, fileName, size) {
  var cached = cachedPathImage(year, albumName, fileName, size);
  var original = originalPath(year, albumName, fileName);

  try {
    if(exists(cached)) {
      deferred.resolve(cached);
    } else {
      resizeImage(original, cached, size, deferred);
    }
  } catch(err) {
    deferred.reject(err);
  }
}

function handleVideoRequest(deferred, year, albumName, fileName, size) {
  var cached = cachedPathVideo(year, albumName, fileName, size);
  var original = originalPath(year, albumName, fileName);

  try {
    if(exists(cached)) {
      deferred.resolve(cached);
    } else {
      resizeVideo(original, cached, size, deferred);
    }
  } catch(err) {
    deferred.reject(err);
  }
}

exports.fromCacheOrGenerate = function (type, year, albumName, fileName, size) {
  var deferred = Q.defer();

  if(type === 'image') {
    handleImageRequest(deferred, year, albumName, fileName, size);
  } else if (type === 'video') {
    handleVideoRequest(deferred, year, albumName, fileName, size);
  } else {
    deferred.reject(new Error('I do not know what to do with type ' + type + '.'));
  }

  return deferred.promise;
};
