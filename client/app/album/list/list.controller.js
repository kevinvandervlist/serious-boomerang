'use strict';

angular.module('seriousBoomerangApp')
  .controller('AlbumListCtrl', function ($scope, $http, AlbumGrouper, URLFactory, Auth) {
    $scope.isAdmin = Auth.isAdmin;

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