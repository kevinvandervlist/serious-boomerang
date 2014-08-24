'use strict';

var mongoose = require('mongoose');
var Location = require('../location/location.model');
var StringUtils = require('../../util/StringUtils');
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
  .validate(function(v) {
    return StringUtils.isNotEmpty(v);
  }, 'Album name cannot be blank');

AlbumSchema
  .path('description')
  .validate(function(v) {
    return StringUtils.isNotEmpty(v);
  }, 'Description cannot be blank');

AlbumSchema
  .virtual('year')
  .get(function() {
    var d = new Date(this.startDate);
    return d.getFullYear();
  });

module.exports = mongoose.model('Album', AlbumSchema);
