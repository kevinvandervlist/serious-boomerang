'use strict';

var Album = require('./album.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function (res, err) {
  return res.json(422, err);
};

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
 *
 */
exports.albumdetails = function (req, res) {
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


/**
 * Creates a new album
 */
exports.create = function (req, res, next) {
  var newAlbum = new Album(req.body);
  newAlbum.provider = 'local';
  newAlbum.role = 'album';
  newAlbum.save(function (err, album) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: album._id }, config.secrets.session, { expiresInMinutes: 60 * 5 });
    res.json({ token: token });
  });
};

