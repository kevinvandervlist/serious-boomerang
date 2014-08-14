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

AlbumSchema
  .path('name')
  .validate(function(name) {
    return name.length;
  }, 'Album name cannot be blank');

AlbumSchema
  .path('description')
  .validate(function(desc) {
    return desc.length;
  }, 'Description cannot be blank');

AlbumSchema
  .virtual('year')
  .get(function() {
    var d = new Date(this.startDate);
    return d.getFullYear();
  });

module.exports = mongoose.model('Album', AlbumSchema);
