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

function getMediaFiles(rx, $http, mediaObservable, imageFilesObserverPromise, size) {
  mediaObservable
    .subscribe(function (media) {
      var url = '/api/media/' + media.albumId + '/' + media._id + '/retrieve';
      if(size) {
        url += size;
      }
      rx.Observable
        .fromPromise($http.get(url))
        .map(function(response) {
          return response.data;
        })
        .subscribe(function (image) {
          imageFilesObserverPromise.then(function(observer) {
            observer.onNext(image);
          });
        });
    });
}

angular.module('seriousBoomerangApp')
  .controller('AlbumViewCtrl', function ($scope, $stateParams, $http, $q) {
    var rx = Rx; // jshint ignore:line
    $scope.album = null;
    $scope.images = [];

    var deferredImageFilesObserver = $q.defer();
    var imageFilesObservable = rx.Observable.create(function (observer) {
      deferredImageFilesObserver.resolve(observer);
    });

    var albumDetails = $http.get('/api/album/' + $stateParams.year + '/' + $stateParams.name);
    var deferredMediaDetails = $q.defer();

    var albumPromise = getAlbumDetails(rx, $q, $http, albumDetails, deferredMediaDetails);
    var mediaObservable = getMediaDetails(rx, deferredMediaDetails.promise);

    albumPromise.then(function (album) {
      $scope.album = album;
    });

    mediaObservable.subscribe(function (media) {
      $scope.images.push(media);
    });

    getMediaFiles(rx, $http, mediaObservable, deferredImageFilesObserver.promise);

    imageFilesObservable
      .subscribe(function (image) {
        console.log(image);
      });
  });
