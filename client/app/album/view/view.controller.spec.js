'use strict';

describe('Controller: AlbumViewCtrl', function () {
  // load the controller's module
  beforeEach(module('seriousBoomerangApp'));

  var AlbumViewCtrl,
    scope,
    $httpBackend;

  var album = {
      name: 'Baz',
      description: 'Album baz yay',
      startDate: new Date(1293682178 * 1000),
      endDate: new Date(1293683178 * 1000),
      locations: []
    };

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/album/2010/Baz')
      .respond(album);

    scope = $rootScope.$new();
    AlbumViewCtrl = $controller('AlbumViewCtrl', {
      $scope: scope,
      $stateParams: {
        name: 'Baz',
        year: '2010'
      }
    });
  }));

  it('should have gotten an album', function () {
    $httpBackend.flush();
    expect(scope.album.name).toBe(album.name);
    expect(scope.album.description).toBe(album.description);
    expect(scope.album.locations.length).toBe(0);
  });

  it('should have received string representations of the dates.', function() {
    $httpBackend.flush();
    expect(scope.album.startDateStr).toBe('4-11-2010');
    expect(scope.album.endDateStr).toBe('4-11-2010');
  })
});
