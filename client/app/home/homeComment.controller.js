'use strict';

angular.module('seriousBoomerangApp')
  .controller('homeCommentCtrl', function ($scope, $http, $q, URLFactory, HtmlUtilities, rx, RXUtils) {
    $scope.comments = [];

    RXUtils.observableResourceList($http.get(URLFactory.getLatestComments(10)))
      .flatMap(function(comment) {
        return RXUtils.observableResource($http.get(URLFactory.getUserBy(comment.author)))
          .map(function(user) {
            comment.author = user;
            return comment;
          });
      })
      .subscribe(function(comment) {
        $scope.comments.push(comment);
      });
  });
