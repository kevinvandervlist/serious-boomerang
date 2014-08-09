'use strict';

angular.module('seriousBoomerangApp')
  .controller('UploadInfoCtrl', function ($scope, $http, AlbumGrouper, URLFactory) {
    $scope.albums = [];

    AlbumGrouper.groupByYear($http.get(URLFactory.getAllowedAlbums()))
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