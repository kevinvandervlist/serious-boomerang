'use strict';

var passport = require('passport');
var config = require('../../config/environment');
var formidable = require('formidable');
var uploadDir = config.mediaDirectory + '/cache/upload/';
var flow = require('./flow')(uploadDir);

exports.handleChunkCheck = function(req, res) {
  flow.get(req, function(status) {
    res.send(200, (status == 'found' ? 200 : 404));
  });
};

exports.handleUpload = function(req, res) {
  var form = new formidable.IncomingForm();
  form.uploadDir = uploadDir;

  form.parse(req, function(err, fields, files) {
    if(err) {
      res.send(500, err);
    } else {
      flow.post(req, fields, files.file.path, function() {
        res.send(200);
      })
    }
  });
};
