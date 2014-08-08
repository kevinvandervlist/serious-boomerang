'use strict';

angular.module('seriousBoomerangApp')
  .controller('albumPermissionsCtrl', function ($scope, $http, AlbumGrouper, rx, RXUtils, URLFactory) {
    $scope.albums = [];
    $scope.users = [];
    $scope.permissions = [];
    $scope.checkboxValues = {};

    var albums = AlbumGrouper.groupByYear($http.get(URLFactory.getAllAlbums()));
    var users = RXUtils.observableResourceList($http.get(URLFactory.getAllUsers()));
    var permissions = RXUtils.observableResourceList($http.get(URLFactory.getAllAlbumPermissions()));

    $scope.togglePermission = function(albumId, userId, $event) {
      var action;
      var permission = {
        appliedAlbumId: albumId,
        referencedUserId: userId
      };

      if($event.target.checked) {
        action = $http.post(URLFactory.storeNewAlbumPermission(), permission);
      } else {
        action = $http.delete(URLFactory.deleteExistingAlbumPermission(albumId, userId));
      }

      action
        .success(function(data, status) {
          if(status === 200) {
            console.log('Success');
          } else {
            console.error('failure');
          }
        });
    };

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

    users.subscribe(function(user) {
      $scope.users.push(user);
    });

    permissions.subscribe(function(permission) {
      $scope.permissions.push(permission);
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
      }).subscribe(function(tuple) {
        $scope.checkboxValues[tuple.album._id + '-' + tuple.user._id] = false;
      }, function(err) {
        console.error(err);
      }, function() {
        permissions
          .subscribe(function(perm) {
            $scope.checkboxValues[perm.appliedAlbumId + '-' + perm.referencedUserId] = true;
          });
      });
  });
