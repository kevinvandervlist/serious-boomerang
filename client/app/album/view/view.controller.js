'use strict';

function humanReadableDate(date) {
  var d = new Date(date);
  return d.getDay() + '-' + d.getMonth() + '-' + d.getFullYear();
}

function getResourceObservable(rx, httpGetPromise) {
    return rx.Observable
        .fromPromise(httpGetPromise)
        .map(function (response) {
            return response.data;
        });
}

function getResourceListObservable(rx, httpGetPromise) {
    return getResourceObservable(rx, httpGetPromise)
        .flatMap(rx.Observable.fromArray);
}

function getAlbumDetails(rx, $q, $http, albumDetailsPromise, deferredMediaDetails) {
  var deferredAlbum = $q.defer();

  getResourceObservable(rx, albumDetailsPromise)
    .subscribe(function (album) {
      $http.get('/api/media/' + album._id).
        then(function (result) {
          deferredMediaDetails.resolve(result);
        });

      album.startDateStr = humanReadableDate(album.startDate);
      album.endDateStr = humanReadableDate(album.startDate);
      deferredAlbum.resolve(album);
    });

  return deferredAlbum.promise;
}

function getMediaLinksObservable(rx, mediaObservable, token) {
  var images = mediaObservable
    .filter(function(media) {
      return media.mediaType === 'image';
    })
    .map(function(media) {
      media.url = '/api/media/' + media.albumId + '/' + media._id + '/jpg/retrieve/' + token + '/';
      return media;
  });

  var videos = mediaObservable
    .filter(function(media) {
      return media.mediaType === 'video';
    })
    .map(function(media) {
      media.url = {};
      media.url.webm = '/api/media/' + media.albumId + '/' + media._id + '/webm/retrieve/' + token + '/';
      media.url.mp4 = '/api/media/' + media.albumId + '/' + media._id + '/mp4/retrieve/' + token + '/';
      return media;
    });

  return rx.Observable.merge(
    images,
    videos
  );
}

function retrieveComments(rx, $http, $scope, mediaId) {
  $scope.comments = [];
  getResourceListObservable(rx, $http.get('/api/comment/' + mediaId))
    .flatMap(function(comment) {
      return getResourceObservable(rx, $http.get('/api/users/' + comment.author))
        .take(1)
        .map(function(user) {
          comment.author = user;
          return comment;
        });
    })
    .subscribe(function(comment) {
      $scope.comments.push(comment);
    });
}

angular.module('seriousBoomerangApp')
  .controller('AlbumViewCtrl', function ($scope, $stateParams, $http, $q, HtmlUtilities, rx, authInterceptor) {
    var token = authInterceptor.token();
    var numberOfMediaFiles = -1;

    $scope.album = null;
    $scope.media = [];
    $scope.thumbSize = '345';
    $scope.largeSize = '960';

    $scope.selectedMedia = undefined;
    $scope.prevMediaID = undefined;
    $scope.nextMediaID = undefined;
    $scope.comments = [];

    $scope.util = HtmlUtilities;

    $scope.hasMediaAtPosition = function(id) {
      return (0 <= id) && (id < numberOfMediaFiles);
    };

    $scope.setMedia = function(id) {
      retrieveComments(rx, $http, $scope, $scope.media[id]._id);

      $scope.selectedMedia = $scope.media[id];
      $scope.prevMediaID = id - 1;
      $scope.nextMediaID = id + 1;

      var videos = document.getElementsByTagName('video');

      Array.prototype.forEach.call(videos, function(video) {
        video.pause();
        while (video.firstChild) {
          video.removeChild(video.firstChild);
        }
      });
    };

    $scope.overviewActive = function() {
      return $scope.selectedMedia === undefined;
    };

    var albumDetails = $http.get('/api/album/' + $stateParams.year + '/' + $stateParams.name);
    var deferredMediaDetails = $q.defer();

    var albumPromise = getAlbumDetails(rx, $q, $http, albumDetails, deferredMediaDetails);
    var mediaObservable = getResourceListObservable(rx, deferredMediaDetails.promise);

    albumPromise.then(function (album) {
      $scope.album = album;
    });

    getMediaLinksObservable(rx, mediaObservable, token)
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
