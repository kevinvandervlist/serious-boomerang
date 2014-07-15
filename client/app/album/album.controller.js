'use strict';

angular.module('seriousBoomerangApp')
  .controller('AlbumCtrl', function ($scope, $http) {
    $scope.albums = [];

    var deferred = $http.get('/api/album');
  /*
    rx.Observable
      .fromPromise(deferred)
      .map(function(response){
        return response.data[1];
      })
      .subscribe(function(album) {
        $scope.albums.push(album);
      })

    .success(function(albums) {
      $scope.albums = albums;
    });
    */
  });