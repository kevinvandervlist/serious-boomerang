'use strict';

var express = require('express');
var controller = require('./media.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:albumId', auth.hasPermission(), controller.index);

module.exports = router;
