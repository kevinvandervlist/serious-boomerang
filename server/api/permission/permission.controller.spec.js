'use strict';

var should = require('should');
var Q = require('q');
var controller = require('./permission.controller');
var config = require('../../config/environment');
var AlbumPermission = require('./album.permission.model');
var Media = require('../media/media.model');
var User = require('../user/user.model');
var Album = require('../album/album.model');
var ExpressControllerTester = require('../../util/ExpressControllerTester');

var album, userA, userB, media;

function continuation(defer) {
  return function (err) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve();
    }
  };
}

describe('Permission controller', function () {
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
      role: 'admin',
      password: 'password'
    });

    Q.all([
      Q.ninvoke(album, 'save'),
      Q.ninvoke(userA, 'save'),
      Q.ninvoke(userB, 'save')
    ]).then(function() {
      media = new Media({
        albumId: album._id,
        name: 'foo.jpg  ',
        addedOn: new Date(),
        timestamp: new Date(),
        mediaType: 'image'
      });
      return Q.ninvoke(media, 'save');
    }).then(function () {
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

  it('should return no permissions', function (done) {
    ExpressControllerTester.doRequest(controller.allAlbumPermissions, done)
      .asUser(userB)
      .asResponse('json')
      .withValidation(function(result, code) {
        code.should.be.exactly(200);
        result.should.have.length(0);
      });
  });

  it('should return a permission for user A and album.', function (done) {
    new AlbumPermission({
      appliedAlbumId: album._id,
      referencedUserId: userA._id
    }).save(function() {
        ExpressControllerTester.doRequest(controller.allAlbumPermissions, done)
          .asUser(userB)
          .asResponse('json')
          .withValidation(function(result, code) {
            code.should.be.exactly(200);
            result.should.have.length(1);
            result[0].appliedAlbumId.should.be.eql(album._id);
            result[0].referencedUserId.should.be.eql(userA._id);
          });
      });
  });

  it('should be able to delete an existing album permission', function (done) {
    new AlbumPermission({
      appliedAlbumId: album._id,
      referencedUserId: userA._id
    }).save(function() {
        var defer = Q.defer();
        var cont = continuation(defer);

        ExpressControllerTester.doRequest(controller.allAlbumPermissions, cont)
          .asUser(userB)
          .asResponse('json')
          .withValidation(function(result, code) {
            code.should.be.exactly(200);
            result.should.have.length(1);
            result[0].appliedAlbumId.should.be.eql(album._id);
            result[0].referencedUserId.should.be.eql(userA._id);
          });

        defer.promise.then(function() {
          var defer = Q.defer();
          var cont = continuation(defer);
          ExpressControllerTester.doRequest(controller.deleteAlbumPermission, cont)
            .asUser(userB)
            .withParams({albumId: album._id, userId: userA._id})
            .asResponse('send')
            .withValidation(function(result, code) {
              code.should.be.exactly(200);
            });
          return defer.promise;
        }).then(function() {
          ExpressControllerTester.doRequest(controller.allAlbumPermissions, done)
            .asUser(userB)
            .asResponse('json')
            .withValidation(function(result, code) {
              code.should.be.exactly(200);
              result.should.have.length(0);
            });
        }, function(err) {
          done(err);
        });
      });
  });

  it('should be able to save a new album permission.', function (done) {
    new AlbumPermission({
      appliedAlbumId: album._id,
      referencedUserId: userA._id
    }).save(function() {
        var defer = Q.defer();
        var cont = continuation(defer);

        ExpressControllerTester.doRequest(controller.allAlbumPermissions, cont)
          .asUser(userB)
          .asResponse('json')
          .withValidation(function(result, code) {
            code.should.be.exactly(200);
            result.should.have.length(1);
            result[0].appliedAlbumId.should.be.eql(album._id);
            result[0].referencedUserId.should.be.eql(userA._id);
          });

        defer.promise.then(function() {
          var defer = Q.defer();
          var cont = continuation(defer);
          ExpressControllerTester.doRequest(controller.addAlbumPermission, cont)
            .asUser(userB)
            .withBody({appliedAlbumId: album._id, referencedUserId: userB._id})
            .asResponse('send')
            .withValidation(function(result, code) {
              code.should.be.exactly(200);
            });
          return defer.promise;
        }).then(function() {
          ExpressControllerTester.doRequest(controller.allAlbumPermissions, done)
            .asUser(userB)
            .asResponse('json')
            .withValidation(function(result, code) {
              code.should.be.exactly(200);
              result.should.have.length(2);
            });
        }, function(err) {
          done(err);
        });
      });
  });
});
