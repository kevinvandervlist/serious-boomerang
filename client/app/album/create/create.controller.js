'use strict';


angular.module('seriousBoomerangApp')
  .controller('CreateAlbumCtrl', function ($scope, URLFactory, $http) {
    $scope.album = {};
    $scope.error = undefined;
    $scope.success = undefined;

    $scope.submitNewAlbum = function() {
      $http.post(URLFactory.createAlbum(), $scope.album)
        .success(function(data, status) {
          if(status === 201) {
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