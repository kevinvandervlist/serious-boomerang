'use strict';

var Album = require('./album.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of albums
 */
exports.index = function(req, res) {
  Album.find({}, '-salt -hashedPassword', function (err, albums) {
    if(err) return res.send(500, err);
    res.json(200, albums);
  });
};

/**
 * Creates a new album
 */
exports.create = function (req, res, next) {
  var newAlbum = new Album(req.body);
  newAlbum.provider = 'local';
  newAlbum.role = 'album';
  newAlbum.save(function(err, album) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: album._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single album
 */
exports.show = function (req, res, next) {
  var albumId = req.params.id;

  Album.findById(albumId, function (err, album) {
    if (err) return next(err);
    if (!album) return res.send(401);
    res.json(album.profile);
  });
};
