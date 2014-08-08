'use strict';

var express = require('express');
var controller = require('./permission.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/album/list', auth.hasRole('admin'), controller.allAlbumPermissions);
router.post('/album/add', auth.hasRole('admin'), controller.addAlbumPermission);
router.delete('/album/:albumId/:userId', auth.hasRole('admin'), controller.deleteAlbumPermission);

module.exports = router;
