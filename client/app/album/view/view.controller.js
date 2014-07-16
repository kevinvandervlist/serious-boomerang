'use strict';

function humanReadableDate(date) {
  var d = new Date(date);
  return d.getDay() + '-' + d.getMonth() + '-' + d.getFullYear();
}

angular.module('seriousBoomerangApp')
  .controller('AlbumViewCtrl', function ($scope, $stateParams, $http) {
    var rx = Rx; // jshint ignore:line
    $scope.album = null;
    $scope.images = [];

    var albumDetails = $http.get('/api/album/' + $stateParams.year + '/' + $stateParams.name);

    rx.Observable
      .fromPromise(albumDetails)
      .map(function(response){
        return response.data;
      })
      .subscribe(function(album) {
        var mediaDetails = $http.get('/api/media/' + album._id);

        album.startDateStr = humanReadableDate(album.startDate);
        album.endDateStr = humanReadableDate(album.startDate);
        $scope.album = album;

        rx.Observable
          .fromPromise(mediaDetails)
          .map(function(response) {
            return response.data;
          })
          .flatMap(rx.Observable.fromArray)
          .subscribe(function(media) {
            $scope.images.push(media);
          })
      });
  });
