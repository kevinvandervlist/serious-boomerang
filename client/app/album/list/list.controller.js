'use strict';

angular.module('seriousBoomerangApp')
  .controller('AlbumListCtrl', function ($scope, $http, AlbumGrouper) {
    $scope.albums = [];

    AlbumGrouper.groupByYear($http.get('/api/album'))
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