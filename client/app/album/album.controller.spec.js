'use strict';

describe('Controller: AlbumCtrl', function () {
  // load the controller's module
  beforeEach(module('seriousBoomerangApp'));

  var AlbumCtrl,
    scope,
    $httpBackend;

  var albums = [
    {
      name: 'Foo',
      description: 'Album foo description',
      startDate: new Date(),
      endDate: new Date(),
      locations: []
    }, {
      name: 'Bar',
      description: 'Album bar description',
      startDate: new Date(1293682278 * 1000),
      endDate: new Date(1293683278 * 1000),
      locations: []
    }, {
      name: 'Baz',
      description: 'Album baz yay',
      startDate: new Date(1293682178 * 1000),
      endDate: new Date(1293683178 * 1000),
      locations: []
    }
  ];

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/album')
      .respond(albums);

    scope = $rootScope.$new();
    AlbumCtrl = $controller('AlbumCtrl', {
      $scope: scope
    });
  }));

  it('should attach two years with albums to the scope', function () {
    $httpBackend.flush();
    console.log(scope.albums);
    expect(scope.albums.length).toBe(2);

    expect(scope.albums[0].key).toBe(2014);
    expect(scope.albums[0].albums.length).toBe(1);

    expect(scope.albums[1].key).toBe(2010);
    expect(scope.albums[1].albums.length).toBe(2);
  });
});
