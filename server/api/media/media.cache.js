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

function cachedPathVideo(year, albumName, fileName, size, format) {
  var split = fileName.split('.');
  split.pop();
  var file = split.join('.');
  return config.mediaDirectory + '/cache/' + year + '/' + albumName + '/' + file + '_' + size + '.' + format;
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

function handleImageRequest(deferred, format, year, albumName, fileName, size) {
  var cached = cachedPathImage(year, albumName, fileName, size);
  var original = originalPath(year, albumName, fileName);

  try {
    if(exists(cached)) {
      deferred.resolve(cached);
    } else {
      resizeImage(original, cached, format, size, deferred);
    }
  } catch(err) {
    deferred.reject(err);
  }
}

function handleVideoRequest(deferred, format, year, albumName, fileName, size) {
  var cached = cachedPathVideo(year, albumName, fileName, size, format);
  var original = originalPath(year, albumName, fileName);

  try {
    if(exists(cached)) {
      deferred.resolve(cached);
    } else {
      resizeVideo(original, cached, format, size, deferred);
    }
  } catch(err) {
    deferred.reject(err);
  }
}

exports.fromCacheOrGenerate = function (type, format, year, albumName, fileName, size) {
  var deferred = Q.defer();

  if(type === 'image') {
    handleImageRequest(deferred, format, year, albumName, fileName, size);
  } else if (type === 'video') {
    handleVideoRequest(deferred, format, year, albumName, fileName, size);
  } else {
    deferred.reject(new Error('I do not know what to do with type ' + type + '.'));
  }

  return deferred.promise;
};
