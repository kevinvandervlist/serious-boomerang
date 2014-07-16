'use strict';

var mongoose = require('mongoose');
var Album = require('../album/album.model');
var Schema = mongoose.Schema;

var allowed_types = ['image', 'video'];

var MediaSchema = new Schema({
  albumId: {
    type: String,
    trim: true,
    required: true
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  addedOn: {
    type: Date,
    required: true
  },
  mediaType: {
    type: String,
    trim: true,
    required: true
  }
});

MediaSchema
  .path('albumId')
  .validate(function (v) {
    return v.length;
  }, 'albumId name cannot be blank');

MediaSchema
  .path('albumId')
  .validate(function (v, respond) {
    Album.findOne({
      _id: v
    }, function (err, album) {
      if (err) throw err;
      return respond(album !== null);
    });
  }, 'The referenced album should exist.');

MediaSchema
  .path('albumId')
  .validate(function (v, respond) {
    this.constructor.findOne({
      albumId: v,
      name: this.name
    }, function (err, user) {
      if (err) throw err;
      return respond(user === null);
    });
  }, 'The combination of albumId and name must be unique (image already exists).');

MediaSchema
  .path('name')
  .validate(function (v) {
    return v.length;
  }, 'name cannot be blank');

MediaSchema
  .path('mediaType')
  .validate(function (v) {
    return v.length && allowed_types.indexOf(v) > -1;
  }, 'mediaType cannot be blank');

module.exports = mongoose.model('Media', MediaSchema);
