'use strict';

var Album = require('./album.model');
var passport = require('passport');
var config = require('../../config/environment');

/**
 * Get list of albums
 */
exports.index = function (req, res) {
  Album.find({}, function (err, albums) {
    if (err) return res.send(500, err);
    res.json(200, albums);
  });
};

/**
 * Get the details of an album.
 */
exports.albumDetailsByYearName = function (req, res) {
  var year = req.params.year;
  var name = req.params.name;

  var start = new Date(year, 0, 1);
  var end = new Date(year, 11, 31);

  Album.findOne({
    name: name,
    startDate: {
      $gte: start,
      $lt: end
    }
  }, function (err, album) {
    if (err) return res.send(500, err);
    if (!album) return res.send(401);
    res.json(album);
  });
};
