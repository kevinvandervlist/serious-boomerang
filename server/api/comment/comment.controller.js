'use strict';

var Comment = require('./comment.model');
var passport = require('passport');
var modelUtils = require('../../util/ModelUtils');
var Media = require('../media/media.model');
var PermissionVerifier = require('../permission/permission.verifier');
var config = require('../../config/environment');

exports.allAllowedComments = function (req, res) {
  var ids = PermissionVerifier.allowedAlbumIdsByUserId(req.user._id);
  ids.then(function(allowedIds) {
    return Comment.find({})
      .where('albumId').in(allowedIds)
      .exec();
  }).then(function(comments) {
    res.status(200).json(comments);
  }, function(err) {
    res.status(500).send(err);
  });
};

exports.commentsByMediaId = function (req, res) {
  Comment.find({mediaId: req.params.mediaId}, function (err, comments) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(comments);
    }
  });
};

exports.newComment = function (req, res) {
  function error(err) {
    return res.status(422).json(err);
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
      if (err) {
        return error(err)
      } else {
        res.status(201).send();
      }
    });
  }, function(err) {
    return error(err);
  });
};

exports.latestComments = function(req, res) {
  var ids = PermissionVerifier.allowedAlbumIdsByUserId(req.user._id);
  ids.then(function(allowedIds) {
    return Comment.find({})
      .sort('-timestamp')
      .limit(req.params.amount)
      .where('albumId').in(allowedIds)
      .exec();
  }).then(function(comments) {
    res.status(200).json(comments);
  }, function(err) {
    res.status(500).send(err);
  });
};