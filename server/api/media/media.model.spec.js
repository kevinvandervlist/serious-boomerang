'use strict';

var should = require('should');
var Media = require('./media.model');
var Album = require('../album/album.model');

var albumFoo, albumBar, mediaFoo, mediaBar;

describe('Media Model', function () {
  beforeEach(function(done) {
    // Clear media before testing
    Media.remove().exec().then(function () {
      done();
    });
  });

  beforeEach(function (done) {
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
      done();
    });
  });

  beforeEach(function(done) {
    albumBar = new Album({
      name: 'Bar',
      description: 'Bar',
      startDate: new Date,
      endDate: new Date
    });
    albumBar.save(function () {
      mediaBar = new Media({
        albumId: albumBar._id,
        name: 'bar.jpg',
        addedOn: new Date(),
        timestamp: new Date(),
        mediaType: 'video'
      });
      done();
    });
  });

  afterEach(function (done) {
    Media.remove().exec().then(function () {
      done();
    });
  });

  it('should begin with no media', function (done) {
    Media.find({}, function (err, medias) {
      medias.should.have.length(0);
      done();
    });
  });

  it('should be able to save media', function (done) {
    mediaFoo.save(function() {
      Media.find({}, function (err, medias) {
        medias.should.have.length(1);
        done();
      });
    });
  });

  it('should trim the name field', function (done) {
    mediaFoo.save(function () {
      Media.find({name: 'foo.jpg'}, function (err, media) {
        should.not.exist(err);
        media.should.have.length(1);
        media[0].name.should.equal('foo.jpg');
        done();
      });
    });
  });

  it('should fail when saving a duplicate media item', function (done) {
    mediaBar.save(function () {
      var mediaDup = new Media(mediaBar);
      mediaDup.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when omitting a name', function (done) {
    mediaFoo.name = '';
    mediaFoo.save(function (err) {
      should.exist(err);
      done();
    });
  });

  // How to expect 'Uncaught CastError'?
  //it('should fail when omitting an albumId', function (done) {
  //  mediaFoo.albumId = '';
  //  mediaFoo.save(function (err) {
  //    should.exist(err);
  //  });
  //});

  it('should fail when using an invalid type', function (done) {
    mediaBar.mediaType = 'invalid';
    mediaBar.save(function (err) {
      should.exist(err);
      done();
    });
  });

  it('should fail when referencing an unknown album', function (done) {
    mediaBar.albumId = 'deadbeefca2ab77a3200000d';
    mediaBar.save(function (err) {
      should.exist(err);
      done();
    });
  });
});