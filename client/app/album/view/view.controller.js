'use strict';

function humanReadableDate(date) {
  var d = new Date(date);
  return d.getDay() + '-' + d.getMonth() + '-' + d.getFullYear();
}

function getAlbumDetails(rx, $q, $http, albumDetailsPromise, deferredMediaDetails) {
  var deferredAlbum = $q.defer();

  rx.Observable
    .fromPromise(albumDetailsPromise)
    .map(function(response){
      return response.data;
    })
    .subscribe(function(album) {
      $http.get('/api/media/' + album._id).
        then(function(result) {
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
    .map(function(response) {
      return response.data;
    })
    .flatMap(rx.Observable.fromArray);
}

angular.module('seriousBoomerangApp')
  .controller('AlbumViewCtrl', function ($scope, $stateParams, $http, $q) {
    var rx = Rx; // jshint ignore:line
    $scope.album = null;
    $scope.images = [];

    var albumDetails = $http.get('/api/album/' + $stateParams.year + '/' + $stateParams.name);
    var deferredMediaDetails = $q.defer();

    var albumPromise = getAlbumDetails(rx, $q, $http, albumDetails, deferredMediaDetails);
    var mediaObservable = getMediaDetails(rx, deferredMediaDetails.promise);

    albumPromise.then(function(album) {
      $scope.album = album;
    });

    mediaObservable.subscribe(function(media) {
      $scope.images.push(media);
    });
  });
