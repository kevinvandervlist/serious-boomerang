'use strict';

describe('Controller: AlbumViewCtrl', function () {
  // load the controller's module
  beforeEach(module('seriousBoomerangApp'));

  var AlbumViewCtrl,
    scope,
    $httpBackend;

  var album = {
    _id: '53c6c1de37d5307816c6a3ff',
    name: 'Baz',
    description: 'Album baz yay',
    startDate: new Date(1293682178 * 1000),
    endDate: new Date(1293683178 * 1000),
    locations: []
  };

  var images = [
    {
      albumId: '53c6c1de37d5307816c6a3ff',
      name: 'one.jpg',
      addedOn: new Date(),
      timestamp: new Date(),
      mediaType: 'image'
    }, {
      albumId: '53c6c1de37d5307816c6a3ff',
      name: 'two.jpg',
      addedOn: new Date(),
      timestamp: new Date(),
      mediaType: 'image'
    }, {
      albumId: '53c6c1de37d5307816c6a3ff',
      name: 'three.jpg',
      addedOn: new Date(),
      timestamp: new Date(),
      mediaType: 'image'
    }
  ];

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/album/2010/Baz')
      .respond(album);

    $httpBackend.expectGET('/api/media/53c6c1de37d5307816c6a3ff')
      .respond(images);

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

  it('should have received 3 images', function () {
    $httpBackend.flush();
    expect(scope.images.length).toBe(3);
  });
});
