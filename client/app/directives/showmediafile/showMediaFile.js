'use strict';

angular.module('seriousBoomerangApp')
  .directive('showMediaFile', function (HtmlUtilities) {
    return {
      restrict: 'E',
      scope: {
        mediaFile: '=mediaFile',
        size: '=size'
      },
      controller: function ($scope) {
        $scope.HtmlUtilities = HtmlUtilities;
      },
      templateUrl: '/app/directives/showmediafile/showMediaFile.html'
    };
  });