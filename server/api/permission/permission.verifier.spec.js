'use strict';

var should = require('should');
var Q = require('q');
var AlbumPermission = require('./album.permission.model');
var Media = require('../media/media.model');
var User = require('../user/user.model');
var Album = require('../album/album.model');
var verifier = require('./permission.verifier');

var album, userA, userB, media;

describe('Permission Verifier', function () {
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

  it('userA should start without access', function (done) {
    var permission = verifier.userHasPermissionForAlbum(userA._id, album._id);
    permission.then(function (result) {
      should(result.access).equal(false);
      done();
    }).then(null, function (err) {
      done(err);
    });
  });

  it('userB should start without access', function (done) {
    var permission = verifier.userHasPermissionForAlbum(userA._id, album._id);
    permission.then(function (result) {
      should(result.access).equal(false);
      done();
    }).then(null, function (err) {
      done(err);
    });
  });

  it('User A should have access, user B should not.', function (done) {
    new AlbumPermission({
      appliedAlbumId: album._id,
      referencedUserId: userA._id
    }).save(function () {
        var permissionA = verifier.userHasPermissionForAlbum(userA._id, album._id);
        var resultA = permissionA.then(function (result) {
          should(result.access).equal(true);
        }, function (err) {
          done(err);
        });

        var permissionB = verifier.userHasPermissionForAlbum(userB._id, album._id);
        var resultB = permissionB.then(function (result) {
          should(result.access).equal(false);
        }, function (err) {
          done(err);
        });

        Q.all([
          resultA,
          resultB
        ]).then(function () {
          done();
        }, function (err) {
          done(err);
        });
      });
  });

  it('User B should have access, user A should not.', function (done) {
    new AlbumPermission({
      appliedAlbumId: album._id,
      referencedUserId: userB._id
    }).save(function () {
        var permissionA = verifier.userHasPermissionForAlbum(userA._id, album._id);
        var resultA = permissionA.then(function (result) {
          should(result.access).equal(false);
        }, function (err) {
          done(err);
        });

        var permissionB = verifier.userHasPermissionForAlbum(userB._id, album._id);
        var resultB = permissionB.then(function (result) {
          should(result.access).equal(true);
        }, function (err) {
          done(err);
        });

        Q.all([
          resultA,
          resultB
        ]).then(function () {
          done();
        }, function (err) {
          done(err);
        });
      });
  });

  it('User A and B should have access.', function (done) {
    new AlbumPermission({
      appliedAlbumId: album._id,
      referencedUserId: userA._id
    }).save(function () {
        new AlbumPermission({
          appliedAlbumId: album._id,
          referencedUserId: userB._id
        }).save(function () {
            var permissionA = verifier.userHasPermissionForAlbum(userA._id, album._id);
            var resultA = permissionA.then(function (result) {
              should(result.access).equal(true);
            }, function (err) {
              done(err);
            });

            var permissionB = verifier.userHasPermissionForAlbum(userA._id, album._id);
            var resultB = permissionB.then(function (result) {
              should(result.access).equal(true);
            }, function (err) {
              done(err);
            });

            Q.all([
              resultA,
              resultB
            ]).then(function () {
              done();
            }, function (err) {
              done(err);
            });
          });
      });
  });

  it('User A should have access to the media file, user B should not', function (done) {
    new AlbumPermission({
      appliedAlbumId: album._id,
      referencedUserId: userA._id
    }).save(function () {
        var permissionA = verifier.userHasPermissionForMedia(userA._id, media._id);
        var resultA = permissionA.then(function (result) {
          should(result.access).equal(true);
        }, function (err) {
          done(err);
        });

        var permissionB = verifier.userHasPermissionForMedia(userB._id, media._id);
        var resultB = permissionB.then(function (result) {
          should(result.access).equal(false);
        }, function (err) {
          done(err);
        });

        Q.all([
          resultA,
          resultB
        ]).then(function () {
          done();
        }, function (err) {
          done(err);
        });
      });
  });

  it('Should list an album for user A, but not for B', function(done) {
    new AlbumPermission({
      appliedAlbumId: album._id,
      referencedUserId: userA._id
    }).save(function () {
        var idsA = verifier.allowedAlbumIdsByUserId(userA._id);
        var resultA = idsA.then(function (result) {
          result.should.have.length(1);
        }, function (err) {
          done(err);
        });

        var idsB = verifier.allowedAlbumIdsByUserId(userB._id);
        var resultB = idsB.then(function (result) {
          result.should.have.length(0);
        }, function (err) {
          done(err);
        });

        Q.all([
          resultA,
          resultB
        ]).then(function () {
          done();
        }, function (err) {
          done(err);
        });
      });
  });
});