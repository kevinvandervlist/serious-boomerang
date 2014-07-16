'use strict';

angular.module('seriousBoomerangApp')
  .controller('AlbumViewCtrl', function ($scope, $stateParams, $http) {
    var rx = Rx; // jshint ignore:line
    $scope.album = null;

    var deferred = $http.get('/api/album/' + $stateParams.year + '/' + $stateParams.name);

    rx.Observable
      .fromPromise(deferred)
      .map(function(response){
        return response.data;
      })
      .subscribe(function(album) {
        album.startDateStr = humanReadableDate(album.startDate);
        album.endDateStr = humanReadableDate(album.startDate);
        $scope.album = album;
      });
  });

function humanReadableDate(date) {
  var d = new Date(date);
  return d.getDay() + '-' + d.getMonth() + '-' + d.getFullYear();
}
