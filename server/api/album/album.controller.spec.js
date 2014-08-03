'use strict';

var should = require('should');
var Q = require('q');
var AlbumPermission = require('../permission/album.permission.model');
var Media = require('../media/media.model');
var User = require('../user/user.model');
var Album = require('../album/album.model');
var controller = require('./album.controller');
var ExpressControllerTester = require('../../util/ExpressControllerTester');

var temp = require('../permission/permission.verifier');

var album, userA, userB, media;

describe('Album Controller', function () {
  beforeEach(function (done) {
    album = new Album({
      name: 'Foo',
      description: 'Foo',
      startDate: new Date,
      endDate: new Date
    });
    userA = new User({
      provider: 'local',
      name: 'Fake User',
      email: 'test@test.com',
      password: 'password'
    });
    userB = new User({
      provider: 'local',
      name: 'Fake User 2',
      email: 'another@user.domain',
      password: 'password'
    });

    Q.all([
      Q.ninvoke(album, 'save'),
      Q.ninvoke(userA, 'save'),
      Q.ninvoke(userB, 'save')
    ]).then(function () {
      done();
    }, function (err) {
      done(err);
    });
  });

  afterEach(function (done) {
    Q.all([
      AlbumPermission.remove().exec(),
      Media.remove().exec(),
      User.remove().exec(),
      Album.remove().exec()
    ]).then(function () {
      done();
    }, function (err) {
      done(err);
    });
  });

  it('User A should not see an album.', function (done) {
    ExpressControllerTester.doRequest(controller.index, done)
      .asUser(userA)
      .asResponse('json')
      .withValidation(function(result, code) {
        code.should.be.exactly(200);
        result.should.have.length(0);
      });
  });

  it('User A should see an album.', function (done) {
    new AlbumPermission({
      appliedAlbumId: album._id,
      referencedUserId: userA._id
    }).save(function () {
      ExpressControllerTester.doRequest(controller.index, done)
        .asUser(userA)
        .asResponse('json')
        .withValidation(function(result, code) {
          code.should.be.exactly(200);
          result.should.have.length(1);
        });
      });
  });

});