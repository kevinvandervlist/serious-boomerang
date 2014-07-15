'use strict';

var should = require('should');
var Album = require('./album.model');

var album;

describe('Album Model', function() {
  beforeEach(function(done) {
    album = new Album({
      name: 'A name ',
      description: ' A certain description ',
      startDate: new Date,
      endDate: new Date,
      locations: []
    });

    // Clear albums before testing
    Album.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    Album.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no albums', function(done) {
    Album.find({}, function(err, albums) {
      albums.should.have.length(0);
      done();
    });
  });

  it('should trim the name field', function(done) {
    album.save(function() {
      Album.find({name: 'A name'}, function(err, albums) {
        should.not.exist(err);
        albums.should.have.length(1);
        albums[0].name.should.equal('A name');
        done();
      });
    });
  });

  it('should trim the description field', function(done) {
    album.save(function() {
      Album.find({description: 'A certain description'}, function(err, albums) {
        should.not.exist(err);
        albums.should.have.length(1);
        albums[0].description.should.equal('A certain description');
        done();
      });
    });
  });


  it('should fail when saving a duplicate album', function(done) {
    album.save(function() {
      var albumDup = new Album(album);
      albumDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when omitting a name', function(done) {
    album.name = '';
    album.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should fail when omitting a description', function(done) {
    album.description = '';
    album.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should fail when omitting a start date', function(done) {
    album.startDate = '';
    album.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should fail when omitting an end date', function(done) {
    album.endDate = '';
    album.save(function(err) {
      should.exist(err);
      done();
    });
  });
});