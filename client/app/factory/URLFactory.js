'use strict';

angular.module('seriousBoomerangApp')
  .factory('URLFactory', function () {
    return {
      saveCommentById: function (id) {
        return '/api/comment/' + id;
      },
      getAlbumByYearName: function(year, name) {
        return '/api/album/' + year + '/' + name;
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
      }
    };
  });
