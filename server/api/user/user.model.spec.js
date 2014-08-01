'use strict';

var should = require('should');
var Q = require('q');
var User = require('./user.model');

var user;

describe('User Model', function() {
  before(function() {
    user = new User({
      provider: 'local',
      name: 'Fake User',
      email: 'test@test.com',
      password: 'password'
    });
  });

  afterEach(function(done) {
    Q.all([
      User.remove().exec()
    ]).then(function () {
      done();
    }, function (err) {
      done(err);
    });
  });

  it('should begin with no users', function(done) {
    User.find({}, function(err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate user', function(done) {
    user.save(function() {
      var userDup = new User(user);
      userDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without an email', function(done) {
    user.email = '';
    user.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it("should authenticate user if password is valid", function() {
    user.authenticate('password').should.be.true;
  });

  it("should not authenticate user if password is invalid", function() {
    user.authenticate('blah').should.not.be.true;
  });
});