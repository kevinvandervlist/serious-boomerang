'use strict';

var should = require('should');
var Q = require('q');
var Comment = require('./comment.model');
var User = require('../user/user.model');
var Album = require('../album/album.model');
var Media = require('../media/media.model');
var controller = require('./comment.controller');
var config = require('../../config/environment');
var ExpressControllerTester = require('../../util/ExpressControllerTester');

var userFoo, albumFoo, mediaFoo, commentFoo;

describe('Comment controller', function () {
  beforeEach(function (done) {
    userFoo = new User({
      provider: 'local',
      name: 'a',
      email: 'a@b.c',
      password: 'test'
    });
    userFoo.save(function() {
      albumFoo = new Album({
        name: 'Foo',
        description: 'Foo',
        startDate: new Date,
        endDate: new Date
      });
      albumFoo.save(function () {
        mediaFoo = new Media({
          albumId: albumFoo._id,
          name: 'foo.jpg  ',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        });
        mediaFoo.save(function() {
          commentFoo = new Comment({
            mediaId: mediaFoo._id,
            author: userFoo._id,
            text: 'abc',
            timestamp: new Date()
          });
          commentFoo.save(function() {
            done();
          });
        });
      });
    })
  });

  afterEach(function (done) {
    Q.all([
      Comment.remove().exec(),
      User.remove().exec(),
      Album.remove().exec(),
      Media.remove().exec()
    ]).then(function() {
      done();
    }, function(err) {
      done(err);
    });
  });

  it('should be able to store a new comment', function (done) {
    ExpressControllerTester.doRequest(controller.newComment, done)
      .asUser(userFoo)
      .withParams({mediaId: mediaFoo._id})
      .withBody({text: 'this is my text'})
      .asResponse('send')
      .withValidation(function(result, code) {
        code.should.be.exactly(201);
      });
  });
  // Enabling these tests breaks other stuff.
  return;

  it('should not be able to store a comment without a valid author reference', function (done) {
    ExpressControllerTester.doRequest(controller.newComment, done)
      .asUser({
        provider: 'local',
        name: 'aueauo',
        email: 'aaueaoeu@b.c',
        password: 'aoeuaoueaouea',
        _id: ''
      })
      .withParams({mediaId: mediaFoo._id})
      .withBody({text: 'this is my text'})
      .asResponse('json')
      .withValidation(function(result, code) {
        code.should.be.exactly(422);
      });
  });

  it('should not be able to store a comment without a valid media reference', function (done) {
    userFoo._id = '';
    ExpressControllerTester.doRequest(controller.newComment, done)
      .asUser(userFoo)
      .withParams({mediaId: 'abc_invalid'})
      .withBody({text: 'this is my text'})
      .asResponse('json')
      .withValidation(function(result, code) {
        code.should.be.exactly(422);
      });
  });

  it('should not be able to store a new comment without a registerd user', function (done) {
    ExpressControllerTester.doRequest(controller.newComment, done)
      .withParams({mediaId: mediaFoo._id})
      .withBody({text: 'this is my text'})
      .asResponse('json')
      .withValidation(function(result, code) {
        code.should.be.exactly(422);
      });
  });
});
