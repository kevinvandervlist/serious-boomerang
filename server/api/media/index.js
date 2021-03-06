'use strict';

var express = require('express');
var controller = require('./media.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:albumId', auth.hasPermission(), controller.index);
router.get('/:albumId/:mediaId/describe', auth.hasPermission(), controller.describeSingleFile);
router.delete('/:albumId/:mediaId', auth.hasRole('admin'), controller.deleteSingleFile);
router.get('/:albumId/:mediaId/:format/retrieve/:access_token/:size?', auth.hasPermission(), controller.getSingleFile);

module.exports = router;
