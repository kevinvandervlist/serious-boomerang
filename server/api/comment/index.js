'use strict';

var express = require('express');
var controller = require('./comment.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

module.exports = router;
