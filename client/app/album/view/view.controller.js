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
  .controller('AlbumViewCtrl', function ($scope, $stateParams, $http, $q, authInterceptor) {
    var rx = Rx; // jshint ignore:line
    var token = authInterceptor.token();
    var numberOfImages = -1;

    $scope.album = null;
    $scope.images = [];
    $scope.thumbSize = '345';
    $scope.largeSize = '960';

    $scope.selectedImage = undefined;
    $scope.prevImageID = undefined;
    $scope.nextImageID = undefined;

    $scope.hasImageAtPosition = function(id) {
      return (0 <= id) && (id < numberOfImages);
    };

    $scope.setImage = function(id) {
      $scope.selectedImage = $scope.images[id];
      $scope.prevImageID = id - 1;
      $scope.nextImageID = id + 1;
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
        $scope.images.push(media);
      }, function(err) {}, function() {
        numberOfImages = $scope.images.length;
        // Now we received all images we can sort the images array.
        $scope.images.sort(function(a, b) {
          return new Date(a.timestamp) - new Date(b.timestamp);
        });
      });
  });
