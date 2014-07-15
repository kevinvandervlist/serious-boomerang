'use strict';

var mongoose = require('mongoose');
var Location = require('../location/location.model');
var Schema = mongoose.Schema;

var AlbumSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  locations: {
    type: [Location],
    ref: Location
  }
});

// Validate album name
AlbumSchema
  .path('name')
  .validate(function(name) {
    return name.length;
  }, 'Album name cannot be blank');

// Validate description
AlbumSchema
  .path('description')
  .validate(function(desc) {
    return desc.length;
  }, 'Description cannot be blank');

// Validate date
AlbumSchema
  .path('startDate')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, album) {
      if(err) throw err;
      if(album) {
        if(self.id === album.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

module.exports = mongoose.model('Album', AlbumSchema);
