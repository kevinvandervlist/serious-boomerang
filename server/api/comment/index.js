'use strict';

var express = require('express');
var controller = require('./comment.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.allAllowedComments);
router.get('/:mediaId', auth.hasPermission(), controller.commentsByMediaId);
router.post('/:mediaId', auth.hasPermission(), controller.newComment);
router.get('/latest/:amount', auth.isAuthenticated(), controller.latestComments);

module.exports = router;
