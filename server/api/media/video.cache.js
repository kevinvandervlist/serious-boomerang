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

function exists(path) {
  return fs.existsSync(path);
}

exports.fromCache = function (year, albumName, fileName, size) {
  var deferred = Q.defer();

  try {
    deferred.resolve('/opt/serious-boomerang/media/2014/Foo/three_tc.mp4');
  } catch(err) {
    deferred.reject(err);
  }

  return deferred.promise;
};

