'use strict';

var config = require('../../config/environment');
var Album = require('../album/album.model');
var Cache = require('../media/media.cache');
var Media = require('./media.model');
var Q = require('q');
var fs = require('fs');
var winston = require('winston');

var rename = Q.denodeify(fs.rename);

var jobs = [];
var active = false;

function moveFile(job) {
  winston.debug('Moving an uploaded file from ' + job.curPath + ' to ' + job.newPath);
  return rename(job.curPath, job.newPath)
    .then(function() {
      return job;
    });
}

function handleJob(job) {
  winston.debug('handleJob entry, findById: ' + job.id.toString());
  var dataDescription = Media
    .findById(job.id)
    .exec()
    .then(function(media) {
      winston.debug('handleJob found media with id ' + media._id.toString() + '. Using albumId: ' + media.albumId.toString());
      return Album
        .findById(media.albumId)
        .exec()
        .then(function(album) {
          winston.debug('handleJob found album with id: ' + album._id.toString());
          return {
            media: media,
            album: album
          };
        })
    }, function(err) {
      winston.error({
        message: 'handleJob error:',
        error: err
      });
    });
  if(job.type === 'image') {
    winston.debug('handleJob type: image');
    return dataDescription
      .then(handleImageJob);
  } else if (job.type === 'video') {
    winston.debug('handleJob type: video');
    return dataDescription
      .then(handleVideoJob);
  } else {
    var err = new Error('Invalid job type: ' + job.type);
    winston.error(err);
    deferred.reject(err);
    return deferred.promise;
  }
}

function execution() {
  if(jobs.length > 0) {
    var job = jobs.pop();
    winston.info('execution(): starting a job chain');
    winston.debug(job);
    var async = Q.defer();
    async.promise.then(moveFile).then(handleJob).then(execution);
    async.resolve(job);
  } else {
    winston.debug('execution(): no more jobs. Mark as inactive.');
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
    .fromCacheOrGenerate('video', 'webm', data.album.year, data.album.name, data.media.name, 345)
    .then(function() {
      return Cache.fromCacheOrGenerate('video', 'webm', data.album.year, data.album.name, data.media.name, 960)
    })
    .then(function() {
      return Cache.fromCacheOrGenerate('video', 'mp4', data.album.year, data.album.name, data.media.name, 345);
    })
    .then(function() {
      return Cache.fromCacheOrGenerate('video', 'mp4', data.album.year, data.album.name, data.media.name, 960);
    })
}

exports.addNewJob = function (description) {
  winston.debug('addNewJob: receiving: ');
  winston.debug(description);
  jobs.push({
    curPath: description.curPath,
    newPath: description.newPath,
    id: description.id,
    type: description.type
  });
  if(!active) {
    active = true;
    execution().then(function() {
      winston.info('all jobs completed successfully');
    }, function(err) {
      winston.error(err);
    });
  }
};
