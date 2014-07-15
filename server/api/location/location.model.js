'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
  description: {
    type: String,
    trim: true,
    required: true
  },
  street: {
    type: String,
    trim: true
  },
  number: {
    type: Number
  },
  numberSuffix: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  location: {
    type: [],
    index: '2d'
  }
});

LocationSchema
  .path('description')
  .validate(function(value) {
    return value && value.length;
  }, 'Description cannot be left blank');

LocationSchema
  .path('location')
  .validate(function(value) {
    return value && value.length === 2;
  }, 'A location should have a longitude and a latitude');

module.exports = mongoose.model('Location', LocationSchema);
