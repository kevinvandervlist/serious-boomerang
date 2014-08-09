'use strict';

var mongoose = require('mongoose');
var Media = require('../media/media.model');
var User = require('../user/user.model');
var Album = require('../album/album.model');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  mediaId: {
    type: String,
    trim: true,
    required: true
  },
  albumId: {
    type: Schema.Types.ObjectId,
    trim: true,
    required: true
  },
  author: {
    type: String,
    trim: true,
    required: true
  },
  text: {
    type: String,
    trim: true,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  }
});

CommentSchema
  .path('mediaId')
  .validate(function (v) {
    return v.length;
  }, 'mediaId name cannot be blank');

CommentSchema
  .path('mediaId')
  .validate(function (v, respond) {
    Media.findOne({
      _id: v
    }, function (err, album) {
      if (err) throw err;
      return respond(album !== null);
    });
  }, 'The referenced media file should exist.');

CommentSchema
  .path('albumId')
  .validate(function (v) {
    return v.length;
  }, 'albumId name cannot be blank');

CommentSchema
  .path('albumId')
  .validate(function (v, respond) {
    Album.findOne({
      _id: v
    }, function (err, album) {
      if (err) throw err;
      return respond(album !== null);
    });
  }, 'The referenced album should exist.');

CommentSchema
  .path('author')
  .validate(function (v) {
    return v.length;
  }, 'Author cannot be blank');

CommentSchema
  .path('author')
  .validate(function (v, respond) {
    User.findOne({
      _id: v
    }, function (err, user) {
      if (err) throw err;
      return respond(user !== null);
    });
  }, 'The referenced author should exist.');

CommentSchema
  .path('text')
  .validate(function (v) {
    return v.length;
  }, 'Text cannot be left blank');

CommentSchema
  .path('timestamp')
  .validate(function (v) {
    return v.length;
  }, 'Timestamp cannot be blank');

module.exports = mongoose.model('Comment', CommentSchema);
