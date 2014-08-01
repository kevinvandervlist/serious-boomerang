'use strict';

var express = require('express');
var controller = require('./album.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasPermission(), controller.index);
router.get('/:year/:name', auth.hasPermission(), controller.albumDetailsByYearName);

module.exports = router;
