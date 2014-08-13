'use strict';

var express = require('express');
var controller = require('./upload.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:year/:name/flow', auth.isAuthenticated(), controller.handleChunkCheck);
router.post('/:year/:name/flow', auth.isAuthenticated(),  controller.handleUpload);

module.exports = router;
