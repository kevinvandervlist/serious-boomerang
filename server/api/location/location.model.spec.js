'use strict';

var should = require('should');
var Q = require('q');
var Location = require('./location.model');

var location;

describe('Location Model', function() {
  before(function() {
    location = new Location({
      description: " Dit is een beschrijving. ",
      street: " Straat ",
      number: 9,
      nuberSuffix: "c",
      zipCode: "2965BC",
      city: "Nieuwpoort ",
      country: " The Netherlands ",
      location: [
        4.870551422615059,
        51.932412885903354
      ]
    });
  });

  afterEach(function(done) {
    Q.all([
      Location.remove().exec()
    ]).then(function() {
      done();
    }, function(err) {
      done(err);
    });
  });

  it('should begin with no locations', function(done) {
    Location.find({}, function(err, locations) {
      locations.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate location', function(done) {
    location.save(function() {
      var locationDup = new Location(location);
      locationDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without a description', function(done) {
    location.description = '';
    location.save(function(err) {
      should.exist(err);
      done();
    });
  });
});