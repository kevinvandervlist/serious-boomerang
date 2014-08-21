'use strict';

var express = require('express');
var controller = require('./album.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/all', auth.hasRole('admin'), controller.all);
router.get('/:year/:name', auth.isAuthenticated(), controller.albumDetailsByYearName);
router.post('/create', auth.hasRole('admin'), controller.createNewAlbum);

module.exports = router;
