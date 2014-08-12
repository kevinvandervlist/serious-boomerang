'use strict';

angular.module('seriousBoomerangApp')

  .controller('UploadCtrl', function ($scope, $stateParams) {
    $scope.albumName = $stateParams.name;

    $scope.flowError = function () {
      console.log('Error!');
    };
    $scope.flowComplete = function () {
      console.log('Complete!');
    };
    $scope.flowUploadStarted = function () {
      console.log('flowUploadStarted!');
    };
    $scope.flowProgress = function () {
      console.log('flowProgress!');
      console.log($scope);
    };
  });