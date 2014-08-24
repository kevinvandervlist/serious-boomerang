'use strict';

angular.module('seriousBoomerangApp')
  .directive('commentBlock', function (HtmlUtilities) {
    return {
      restrict: 'E',
      scope: {
        availableComments: '=comments'
      },
      controller: function ($scope) {
        $scope.HtmlUtilities = HtmlUtilities;
      },
      templateUrl: '/app/directives/commentblock/commentBlock.html'
    };
  });