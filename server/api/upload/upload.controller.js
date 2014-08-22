'use strict';

var passport = require('passport');
var config = require('../../config/environment');
var formidable = require('formidable');
var uploadDir = config.mediaDirectory + '/cache/upload/';
var flow = require('./flow')(uploadDir);

exports.handleChunkCheck = function(req, res) {
  flow.get(req, function(status) {
    var res = (status === 'found' ? 200 : 404);
    res.status(res).send(res);
  });
};

exports.handleUpload = function(req, res) {
  var form = new formidable.IncomingForm();
  form.uploadDir = uploadDir;

  form.parse(req, function(err, fields, files) {
    if(err) {
      res.status(500).send(err);
    } else {
      flow.post(req, fields, files.file.path, function() {
        res.status(200).send();
      })
    }
  });
};
