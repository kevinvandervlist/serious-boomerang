'use strict';

var mongoose = require('mongoose');
var Album = require('../album/album.model');
var User = require('../user/user.model');
var Schema = mongoose.Schema;

var AlbumPermissionSchema = new Schema({
  appliedAlbumId: {
    type: Schema.Types.ObjectId,
    trim: true,
    required: true
  },
  referencedUserId: {
    type: Schema.Types.ObjectId,
    trim: true,
    required: true
  }
});

AlbumPermissionSchema
  .path('appliedAlbumId')
  .validate(function (v) {
    return v.length;
  }, 'appliedAlbumId cannot be blank');

AlbumPermissionSchema
  .path('appliedAlbumId')
  .validate(function (v, respond) {
    Album.findOne({
      _id: v
    }, function (err, user) {
      if (err) throw err;
      return respond(user !== null);
    });
  }, 'The referenced album should exist.');

AlbumPermissionSchema
  .path('referencedUserId')
  .validate(function (v) {
    return v.length;
  }, 'referencedUserId cannot be blank');

AlbumPermissionSchema
  .path('referencedUserId')
  .validate(function (v, respond) {
    User.findOne({
      _id: v
    }, function (err, user) {
      if (err) throw err;
      return respond(user !== null);
    });
  }, 'The referenced user should exist.');


module.exports = mongoose.model('AlbumPermission', AlbumPermissionSchema);
