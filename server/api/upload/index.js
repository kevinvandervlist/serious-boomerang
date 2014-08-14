'use strict';

var express = require('express');
var controller = require('./upload.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:albumId/flow', auth.hasPermission(), controller.handleChunkCheck);
router.post('/:albumId/flow', auth.hasPermission(),  controller.handleUpload);

module.exports = router;
