'use strict';


angular.module('seriousBoomerangApp')
  .controller('CreateAlbumCtrl', function ($scope, URLFactory, $http) {
    $scope.album = {};
    $scope.error = undefined;
    $scope.success = undefined;
    $scope.albumURL = '';

    $scope.submitNewAlbum = function() {
      var album = {
        name: $scope.album.name,
        description: $scope.album.description,
        startDate: $scope.album.startDate,
        endDate: $scope.album.endDate
      };

      $scope.albumURL = '/album/' + new Date(album.startDate).getFullYear() + '/' + album.name;

      $http.post(URLFactory.createAlbum(), album)
        .success(function(data, status) {
          if(status === 201) {
            $scope.album = {};
            $scope.success = 'Het album is aangemaakt.';
          } else {
            $scope.error = 'Helaas, er is iets fout gegaan bij het aanmaken van het album';
          }
        })
        .error(function(data, status) {
          console.error(status + ':' + data);
          $scope.error = 'Helaas, er is iets fout gegaan bij het aanmaken van het album';
        });
    };
  });