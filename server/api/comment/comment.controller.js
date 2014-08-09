'use strict';

var Comment = require('./comment.model');
var passport = require('passport');
var modelUtils = require('../../util/ModelUtils');
var Media = require('../media/media.model');
var config = require('../../config/environment');

exports.allComments = function (req, res) {
  Comment.find({}, function (err, comments) {
    if (err) return res.send(500, err);
    res.json(200, comments);
  });
};

exports.commentsByMediaId = function (req, res) {
  Comment.find({mediaId: req.params.mediaId}, function (err, comments) {
    if (err) return res.send(500, err);
    res.json(200, comments);
  });
};

exports.newComment = function (req, res) {
  function error(err) {
    return res.json(422, err);
  }
  var mediaPromise = modelUtils
    .getAsPromiseOne(Media, {
      _id: req.params.mediaId
    });

  mediaPromise.then(function(media) {
    var comment = new Comment({
      mediaId: req.params.mediaId,
      albumId: media.albumId,
      author: req.user._id,
      text: req.body.text,
      timestamp: new Date()
    });
    comment.save(function(err) {
      if (err) { return error(err) }
      res.send(201);
    });
  }, function(err) {
    return error(err);
  });
};

exports.latestComments = function(req, res) {
  Comment.find({}).sort('-timestamp').limit(req.params.amount).exec(function(err, comments) {
    if (err) return res.send(500, err);
    res.json(200, comments);
  });
};