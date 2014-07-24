'use strict';

function humanReadableDate(date) {
  var d = new Date(date);
  return d.getDay() + '-' + d.getMonth() + '-' + d.getFullYear();
}

function getAlbumDetails(rx, $q, $http, albumDetailsPromise, deferredMediaDetails) {
  var deferredAlbum = $q.defer();

  rx.Observable
    .fromPromise(albumDetailsPromise)
    .map(function (response) {
      return response.data;
    })
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

function getMediaDetails(rx, mediaDetailsPromise) {
  return rx.Observable
    .fromPromise(mediaDetailsPromise)
    .map(function (response) {
      return response.data;
    })
    .flatMap(rx.Observable.fromArray);
}

function getMediaLinksObservable(mediaObservable, token) {
  return mediaObservable
    .map(function(media) {
      media.url = '/api/media/' + media.albumId + '/' + media._id + '/retrieve/' + token + '/';
      return media;
    });
}

angular.module('seriousBoomerangApp')
  .controller('AlbumViewCtrl', function ($scope, $stateParams, $http, $q, $sce, authInterceptor) {
    var rx = Rx; // jshint ignore:line
    var token = authInterceptor.token();
    var numberOfMediaFiles = -1;

    $scope.album = null;
    $scope.media = [];
    $scope.thumbSize = '345';
    $scope.largeSize = '960';

    $scope.selectedMedia = undefined;
    $scope.prevMediaID = undefined;
    $scope.nextMediaID = undefined;

    $scope.hasMediaAtPosition = function(id) {
      return (0 <= id) && (id < numberOfMediaFiles);
    };

    $scope.setMedia = function(id) {
      $scope.selectedMedia = $scope.media[id];
      $scope.prevMediaID = id - 1;
      $scope.nextMediaID = id + 1;
    };

    $scope.asTrustedResource = function(url, size) {
      return $sce.trustAsResourceUrl(url + size);
    };

    $scope.isImage = function(media) {
      if(!media) { return false; }
      return media.mediaType === 'image';
    };

    $scope.isVideo = function(media) {
      if(!media) { return false; }
      return media.mediaType === 'video';
    };

    var albumDetails = $http.get('/api/album/' + $stateParams.year + '/' + $stateParams.name);
    var deferredMediaDetails = $q.defer();

    var albumPromise = getAlbumDetails(rx, $q, $http, albumDetails, deferredMediaDetails);
    var mediaObservable = getMediaDetails(rx, deferredMediaDetails.promise);

    albumPromise.then(function (album) {
      $scope.album = album;
    });

    getMediaLinksObservable(mediaObservable, token)
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
