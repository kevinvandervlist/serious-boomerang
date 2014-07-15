'use strict';

angular.module('seriousBoomerangApp')
  .controller('AlbumCtrl', function ($scope, $http) {
    var rx = Rx; // jshint ignore:line
    $scope.albums = [];

    var deferred = $http.get('/api/album');

    rx.Observable
      .fromPromise(deferred)
      .map(function(response){
        return response.data;
      })
      .flatMap(rx.Observable.fromArray)
      .groupBy(function(album) {
        return new Date(album.startDate).getFullYear();
      })
      .subscribe(function(groupedObservable) {
        var group = {
          key: groupedObservable.key,
          albums: []
        };

        $scope.albums.push(group);

        groupedObservable.subscribe(function(album) {
          group.albums.push(album);
        });
      });
  });