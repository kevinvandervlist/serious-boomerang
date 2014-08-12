'use strict';

var express = require('express');
var controller = require('./upload.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/file', controller.handleChunkCheck);
router.post('/file', controller.handleUpload);

module.exports = router;
