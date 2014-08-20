'use strict';

function getAlbumDetails(RXUtils, $q, $http, util, URLFactory, albumDetailsPromise, deferredMediaDetails) {
  var deferredAlbum = $q.defer();

  RXUtils.observableResource(albumDetailsPromise)
    .subscribe(function (album) {
      $http.get(URLFactory.getMediaByAlbumId(album._id)).
        then(function (result) {
          deferredMediaDetails.resolve(result);
        });

      album.year = util.getYearFromDate(album.startDate);
      album.startDateStr = util.humanReadableDate(album.startDate);
      album.endDateStr = util.humanReadableDate(album.startDate);

      deferredAlbum.resolve(album);
    });

  return deferredAlbum.promise;
}

function getMediaLinksObservable(rx, URLFactory, mediaObservable, token) {
  var images = mediaObservable
    .filter(function(media) {
      return media.mediaType === 'image';
    })
    .map(function(media) {
      media.url = URLFactory.getBaseMediaURLBy(media.albumId, media._id, 'jpg', token);
      return media;
  });

  var videos = mediaObservable
    .filter(function(media) {
      return media.mediaType === 'video';
    })
    .map(function(media) {
      media.url = {};
      media.url.webm = URLFactory.getBaseMediaURLBy(media.albumId, media._id, 'webm', token);
      media.url.mp4 = URLFactory.getBaseMediaURLBy(media.albumId, media._id, 'mp4', token);
      return media;
    });

  return rx.Observable.merge(
    images,
    videos
  );
}

function retrieveComments(RXUtils, $http, URLFactory, $scope, mediaId) {
  $scope.comments = [];
  RXUtils.observableResourceList($http.get(URLFactory.getCommentsBy(mediaId)))
    .flatMap(function(comment) {
      return RXUtils.observableResource($http.get(URLFactory.getUserBy(comment.author)))
        .map(function(user) {
          comment.author = user;
          return comment;
        });
    })
    .subscribe(function(comment) {
      $scope.comments.push(comment);
    });
}

function configureDetailedMediaView(RXUtils, $http, URLFactory, $scope) {
  retrieveComments(RXUtils, $http, URLFactory, $scope, $scope.selectedMedia._id);

  var videos = document.getElementsByTagName('video');

  Array.prototype.forEach.call(videos, function(video) {
    video.pause();
    while (video.firstChild) {
      video.removeChild(video.firstChild);
    }
  });
}

angular.module('seriousBoomerangApp')
  .controller('AlbumViewCtrl', function ($scope, $stateParams, $http, $q, URLFactory, HtmlUtilities, rx, RXUtils, authInterceptor, Auth) {
    var token = authInterceptor.token();
    var numberOfMediaFiles = -1;

    $scope.isAdmin = Auth.isAdmin;

    $scope.album = null;
    $scope.media = [];
    $scope.thumbSize = '345';
    $scope.largeSize = '960';

    $scope.selectedMedia = undefined;
    $scope.prevMediaID = undefined;
    $scope.nextMediaID = undefined;
    $scope.comments = [];
    $scope.comment = {};

    $scope.util = HtmlUtilities;

    $scope.hasMediaAtPosition = function(id) {
      return (0 <= id) && (id < numberOfMediaFiles);
    };

    $scope.setMedia = function(id) {
      if (id === undefined && id >= 0 && id < $scope.media.length) {
        $scope.selectedMedia = undefined;
      } else {
        $scope.selectedMedia = $scope.media[id];
        $scope.prevMediaID = id - 1;
        $scope.nextMediaID = id + 1;
        configureDetailedMediaView(RXUtils, $http, URLFactory, $scope);
      }
    };

    $scope.removeMedia = function(media) {
      $http.delete('/api/media/' + $scope.album._id + '/' + media._id)
        .then(function() {
          var index = $scope.media.indexOf(media);
          if (index > -1) {
            $scope.media.splice(index, 1);
            $scope.setMedia(undefined);
          }
        });
    };

    $scope.overviewActive = function() {
      return $scope.selectedMedia === undefined;
    };

    $scope.saveCommentById = function() {
      $http.post(URLFactory.saveCommentById($scope.selectedMedia._id), $scope.comment)
        .success(function(data, status) {
          if(status === 201) {
            configureDetailedMediaView(RXUtils, $http, URLFactory, $scope);
            $scope.comment = {};
          } else {
            $scope.comment.error = 'Helaas, er is iets fout gegaan: ' + data;
          }
      });
    };

    var albumDetails = $http.get(URLFactory.getAlbumByYearName($stateParams.year, $stateParams.name));
    var deferredMediaDetails = $q.defer();

    var albumPromise = getAlbumDetails(RXUtils, $q, $http, HtmlUtilities, URLFactory, albumDetails, deferredMediaDetails);
    var mediaObservable = RXUtils.observableResourceList(deferredMediaDetails.promise);

    albumPromise.then(function (album) {
      $scope.album = album;
    });

    getMediaLinksObservable(rx, URLFactory, mediaObservable, token)
      .subscribe(function (media) {
        $scope.media.push(media);
      }, function() {}, function() {
        numberOfMediaFiles = $scope.media.length;
        // Now we received all media we can sort the media array.
        $scope.media.sort(function(a, b) {
          return new Date(a.timestamp) - new Date(b.timestamp);
        });
      });
  });
