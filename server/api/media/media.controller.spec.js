'use strict';

var should = require('should');
var Media = require('./media.model');
var Album = require('../album/album.model');
var controller = require('./media.controller');
var ExpressControllerTester = require('../../util/ExpressControllerTester');

var albumFoo, albumBar, mediaFoo, mediaBar;

describe('Media controller', function () {
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

  it('should not have any associated media at the start', function (done) {
    ExpressControllerTester.request(controller.index, done)
      .params({albumId: albumFoo._id})
      .response('json')
      .expect(function(code, result) {
        code.should.be.exactly(200);
        result.should.have.length(0);
      });
  });

  it('should provide a listing of an album when provided with a valid id', function (done) {
    mediaFoo.save(function() {
      ExpressControllerTester.request(controller.index, done)
        .params({albumId: albumFoo._id})
        .response('json')
        .expect(function(code, result) {
          code.should.be.exactly(200);
          result.should.have.length(1);
        });
    });
  });

  it('should return an empty array when an album does not exist', function(done) {
    ExpressControllerTester.request(controller.index, done)
      .params({albumId: 'abc'})
      .response('json')
      .expect(function(code, result) {
        code.should.be.exactly(200);
        result.should.have.length(0);
      });
  });

  it('should not describe a non existing file', function(done) {
    ExpressControllerTester.request(controller.describeSingleFile, done)
      .params({
        albumId: albumFoo._id,
        mediaId: albumFoo._id
      })
      .response('json')
      .expect(function(code, result) {
        code.should.be.exactly(200);
        should.not.exist(result);
      });
  });

  it('should describe an existing file', function (done) {
    mediaFoo.save(function() {
      ExpressControllerTester.request(controller.describeSingleFile, done)
        .params({
          albumId: albumFoo._id,
          mediaId: mediaFoo._id
        })
        .response('json')
        .expect(function(code, result) {
          should.exist(result);
          code.should.be.exactly(200);
          result.should.be.an.Object;
          result._id.should.eql(mediaFoo._id);
          result.albumId.should.eql(albumFoo._id.toString());
          result.name.should.equal('foo.jpg');
        });
    });
  });
});