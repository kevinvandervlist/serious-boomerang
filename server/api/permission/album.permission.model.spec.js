'use strict';

var should = require('should');
var Q = require('q');
var AlbumPermission = require('./album.permission.model');
var User = require('../user/user.model');
var Album = require('../album/album.model');

var album, userA, userB;

describe('Media Model', function () {
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
    }, function(err) {
      done(err);
    });
  });

  afterEach(function (done) {
    Q.all([
      AlbumPermission.remove().exec(),
      User.remove().exec(),
      Album.remove().exec()
    ]).then(function () {
      done();
    }, function (err) {
      done(err);
    });
  });

  it('should begin with no permissions', function (done) {
    AlbumPermission.find({}, function (err, medias) {
      medias.should.have.length(0);
      done();
    });
  });

  it('should accept a valid permission', function (done) {
    new AlbumPermission({
      appliedAlbumId: album._id,
      referencedUserId: userA._id
    }).save(function() {
        AlbumPermission.find({}, function (err, permission) {
          permission.should.have.length(1);
          permission[0].appliedAlbumId.should.eql(album._id);
          permission[0].referencedUserId.should.eql(userA._id);
          done();
      });
    });
  });

  it('should fail when using an invalid album ref', function (done) {
    new AlbumPermission({
      appliedAlbumId: userB._id,
      referencedUserId: userA._id
    }).save(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should fail when referencing an unknown user', function (done) {
    new AlbumPermission({
      appliedAlbumId: album._id,
      referencedUserId: album._id
    }).save(function(err) {
      should.exist(err);
      done();
      });
  });
});