'use strict';

var config = require('../../config/environment');
var gm = require('gm');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var Q = require('q');

function originalPath(year, albumName, fileName) {
  return config.mediaDirectory + '/media/' + year + '/' + albumName + '/' + fileName;
}

function cachedPath(year, albumName, fileName, size) {
  var split = fileName.split('.');
  var ext = split.pop();
  var file = split.join('.');
  return config.mediaDirectory + '/cache/' + year + '/' + albumName + '/' + file + '_' + size + '.' + ext;
}

function exists(path) {
  return fs.existsSync(path);
}

function resize(original, destination, x, deferredResult) {
  var split = destination.split(path.sep);
  split.pop();
  var dir = split.join(path.sep);

  if(!exists(dir)) {
    mkdirp(dir, function (err) {
      if (err) deferredResult.reject(err);
    });
  }

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

exports.fromCacheOrGenerate = function (year, albumName, fileName, size) {
  var deferred = Q.defer();

  var cached = cachedPath(year, albumName, fileName, size);
  var original = originalPath(year, albumName, fileName);

  try {
    if(exists(cached)) {
      deferred.resolve(cached);
    } else {
      resize(original, cached, size, deferred);
    }
  } catch(err) {
    deferred.reject(err);
  }

  return deferred.promise;
};

