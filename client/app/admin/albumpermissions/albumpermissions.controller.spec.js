'use strict';

describe('Controller: albumPermissionsCtrl', function () {
  // load the controller's module
  beforeEach(module('seriousBoomerangApp'));

  var albumPermissionsCtrl,
    scope,
    $httpBackend;

  var albums = [{
    _id: 'albumabc',
    name: 'Foo'
  }];

  var users = [{
    _id: 'userabc',
    name: 'Fake User'
  },{
    _id: 'userabcd',
    name: 'Fake User 2'
  }];

  var permissions = [{
    _id: 'xyz',
    appliedAlbumId: 'albumabc',
    referencedUserId: 'userabc'
  }];

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, URLFactory) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET(URLFactory.getAllAlbums())
      .respond(albums);

    $httpBackend.expectGET(URLFactory.getAllUsers())
      .respond(users);

    $httpBackend.expectGET(URLFactory.getAllAlbumPermissions())
      .respond(permissions);

    scope = $rootScope.$new();
    albumPermissionsCtrl = $controller('albumPermissionsCtrl', {
      $scope: scope
    });
  }));

  it('should have gotten an album and a user', function () {
    $httpBackend.flush();
    expect(scope.albums.length).toBe(1);
    expect(scope.users.length).toBe(2);
    expect(scope.permissions.length).toBe(1);
    $httpBackend.verifyNoOutstandingRequest();
  });
});
