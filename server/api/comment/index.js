'use strict';

var express = require('express');
var controller = require('./comment.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasPermission(), controller.allComments);
router.get('/:mediaId', auth.hasPermission(), controller.commentsByMediaId);
router.post('/:mediaId', auth.hasPermission(), controller.newComment);
router.get('/latest/:amount', auth.hasPermission(), controller.latestComments);

module.exports = router;
