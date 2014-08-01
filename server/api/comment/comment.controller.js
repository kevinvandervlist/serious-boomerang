'use strict';

var Comment = require('./comment.model');
var passport = require('passport');
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

/**
* Creates a new comment
*/
exports.newComment = function (req, res) {
  var comment = new Comment({
    mediaId: req.params.mediaId,
    author: req.user._id,
    text: req.body.text,
    timestamp: new Date()
  });
  comment.save(function(err) {
    if (err) { return res.json(422, err); }
    res.send(201);
  });
};
