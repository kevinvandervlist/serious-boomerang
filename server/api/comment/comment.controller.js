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
