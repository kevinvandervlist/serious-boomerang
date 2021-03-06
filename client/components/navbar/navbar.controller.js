'use strict';

angular.module('seriousBoomerangApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      if(route.length === 1) {
        return $location.path() === route;
      } else {
        return $location.path().slice(0, route.length) === route;
      }
    };
  });