'use strict';

var should = require('should');
var Q = require('q');
var AlbumPermission = require('../permission/album.permission.model');
var Media = require('../media/media.model');
var User = require('../user/user.model');
var Album = require('../album/album.model');
var controller = require('./album.controller');
var ExpressControllerTester = require('../../util/ExpressControllerTester');

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

  it('Everyone should see all albums in admin mode.', function (done) {
    ExpressControllerTester.doRequest(controller.all, done)
      .asResponse('json')
      .withValidation(function (result, code) {
        code.should.be.exactly(200);
        result.should.have.length(1);
      });
  });

  it('Should be able to create an album via the API', function(done) {
    var stepOne = Q.defer();
    var stepTwo = Q.defer();

    ExpressControllerTester.doRequest(controller.all, function() { stepOne.resolve();})
      .asUser(userA)
      .asResponse('json')
      .withValidation(function(result, code) {
        code.should.be.exactly(200);
        result.should.have.length(1);
      });

    stepOne.promise.then(function() {
      ExpressControllerTester.doRequest(controller.createNewAlbum, function() {stepTwo.resolve();})
        .asUser(userA)
        .withBody({
          name: 'een naam',
          description: 'een beschrijving. Wat leuk',
          startDate: '2014-01-01',
          endDate: '2014-12-31'
        })
        .asResponse('send')
        .withValidation(function(result, code) {
          code.should.be.exactly(201);
          result.should.have.length(0);
        })
    });

    stepTwo.promise.then(function() {
      ExpressControllerTester.doRequest(controller.all, done)
        .asUser(userA)
        .asResponse('json')
        .withValidation(function(result, code) {
          code.should.be.exactly(200);
          result.should.have.length(2);
          result[1].name.should.be.exactly('een naam');
          result[1].description.should.be.exactly('een beschrijving. Wat leuk');
          result[1].startDate.should.be.eql(new Date('2014-01-01'));
          result[1].endDate.should.be.eql(new Date('2014-12-31'));
        });
    }, function(err) {
      done(err);
    });
  })
});