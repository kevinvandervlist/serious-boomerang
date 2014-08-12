'use strict';

angular.module('seriousBoomerangApp')
  .factory('URLFactory', function () {
    return {
      saveCommentById: function (id) {
        return '/api/comment/' + id;
      },
      getAllowedAlbums: function() {
        return '/api/album';
      },
      getAlbumByYearName: function(year, name) {
        return '/api/album/' + year + '/' + name;
      },
      getAllAlbums: function() {
        return '/api/album/all';
      },
      getMediaByAlbumId: function(albumId) {
        return '/api/media/' + albumId;
      },
      getCommentsBy: function(mediaId) {
        return '/api/comment/' + mediaId;
      },
      getUserBy: function(userId) {
        return '/api/users/' + userId;
      },
      getBaseMediaURLBy: function(albumId, mediaId, type, token) {
        return '/api/media/' + albumId + '/' + mediaId + '/' + type + '/retrieve/' + token + '/';
      },
      getLatestComments: function(amount) {
        return '/api/comment/latest/' + amount;
      },
      getAllUsers: function() {
        return '/api/users/';
      },
      getAllAlbumPermissions: function() {
        return '/api/permission/album/list';
      },
      storeNewAlbumPermission: function() {
        return '/api/permission/album/add';
      },
      deleteExistingAlbumPermission: function(albumId, userId) {
        return '/api/permission/album/' + albumId + '/' + userId;
      },
      uploadFileToAlbum: function(year, name) {
        return '/api/upload/' + year + '/' + name;
      }
    };
  });
