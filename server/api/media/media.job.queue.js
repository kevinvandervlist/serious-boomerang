'use strict';

var config = require('../../config/environment');
var Album = require('../album/album.model');
var Cache = require('../media/media.cache');
var Media = require('./media.model');
var Q = require('q');

var jobs = [];
var active = false;

function handleJob(job) {
  var dataDescription = Media
    .findById(job.id)
    .exec()
    .then(function(media) {
      return Album
        .findById(media.albumId)
        .exec()
        .then(function(album) {
          return {
            media: media,
            album: album
          };
        })
    });
  if(job.type === 'image') {
    return dataDescription
      .then(handleImageJob);
  } else if (job.type === 'video') {
    return dataDescription
      .then(handleVideoJob);
  } else {
    var err = new Error('Invalid job type: ' + job.type);
    console.error(err);
    deferred.reject(err);
    return deferred.promise;
  }
}

function execution() {
  if(jobs.length > 0) {
    var async = Q.defer();
    async.promise.then(handleJob).then(execution);
    async.resolve(jobs.pop());
  } else {
    active = false;
  }
}

function handleImageJob(data) {
  return Cache
    .fromCacheOrGenerate('image', 'jpg', data.album.year, data.album.name, data.media.name, 345)
    .then(function() {
      return Cache.fromCacheOrGenerate('image', 'jpg', data.album.year, data.album.name, data.media.name, 960);
    });
}

function handleVideoJob(data) {
  return Cache
    .fromCacheOrGenerate('image', 'webm', data.album.year, data.album.name, data.media.name, 345)
    .then(function() {
      return Cache.fromCacheOrGenerate('image', 'webm', data.album.year, data.album.name, data.media.name, 960)
    })
    .then(function() {
      return Cache.fromCacheOrGenerate('image', 'mp4', data.album.year, data.album.name, data.media.name, 345);
    })
    .then(function() {
      return Cache.fromCacheOrGenerate('image', 'mp4', data.album.year, data.album.name, data.media.name, 960);
    })
}

exports.addNewJob = function (description) {
  jobs.push({
    newPath: description.newPath,
    id: description.id,
    type: description.type
  });
  if(!active) {
    active = true;
    execution();
  }
};
