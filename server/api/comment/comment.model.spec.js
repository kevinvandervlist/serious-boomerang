'use strict';

var should = require('should');
var Q = require('q');
var Comment = require('./comment.model');
var Album = require('../album/album.model');
var Media = require('../media/media.model');
var User = require('../user/user.model');

var albumFoo;
var mediaFoo;
var userFoo;
var comment;

function createComment(_text, _date) {
  return new Comment({
    mediaId: mediaFoo._id,
    author: userFoo._id,
    text: _text,
    timestamp: _date
  });
}

describe('Comment Model', function() {
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
      mediaFoo.save(function() {
        done();
      });
    });
  });

  beforeEach(function(done) {
    userFoo = new User({
      provider: 'local',
      name: 'Fake User',
      email: 'test@test.com',
      password: 'password'
    });
    userFoo.save(function() {
      done();
    });
  });

  afterEach(function (done) {
    Q.all([
      Comment.remove().exec(),
      User.remove().exec(),
      Album.remove().exec(),
      Media.remove().exec()
    ]).then(function() {
      done();
    }, function(err) {
      done(err);
    });
  });

  it('should begin with no comments', function(done) {
    Comment.find({}, function(err, comments) {
      comments.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate comment', function(done) {
    var comment = createComment('mytext', new Date());

    comment.save(function() {
      var commentDup = new Comment(comment);
      commentDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without a text', function(done) {
    var comment = createComment('', new Date());
    comment.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should fail when saving without a valid media reference', function(done) {
    var comment = createComment('mytext', new Date());
    comment.mediaId = albumFoo._id;
    comment.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should fail when saving without a valid author', function(done) {
    var comment = createComment('mytext', new Date());
    comment.author = albumFoo._id;
    comment.save(function(err) {
      should.exist(err);
      done();
    });
  });
});
