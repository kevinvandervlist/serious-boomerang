'use strict';

function hasPermission(albumId, userId) {
  console.log(albumId + '-' + userId);
  return true;
}

angular.module('seriousBoomerangApp')
  .controller('albumPermissionsCtrl', function ($scope, $http, AlbumGrouper, rx, RXUtils) {
    $scope.albums = [];
    $scope.users = [];
    $scope.checkboxValues = {};

    $scope.togglePermission = function(albumId, userId) {
      console.log('Toggling user id ' + userId + ' to album id ' + albumId + '.');
    };

    var albums = AlbumGrouper.groupByYear($http.get('/api/album/all'));
    albums
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

    var users = RXUtils.observableResourceList($http.get('/api/users/'));
    users.subscribe(function(user) {
      $scope.users.push(user);
    });


    albums
      .flatMap(function(group) {
        return group;
      })
      .flatMap(function(album) {
        return users
          .map(function(user) {
            return {album: album, user: user};
          });
      }).subscribe(function(x) {
        if(! $scope.checkboxValues.hasOwnProperty(x.album._id)) {
          $scope.checkboxValues[x.album._id] = {};
        }
        $scope.checkboxValues[x.album._id][x.user._id] = hasPermission(x.album._id, x.user._id);
      });
  });
