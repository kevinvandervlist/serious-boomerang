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

  var media = [
    {
      _id: '53c6c1de37d5307816c6a300',
      albumId: '53c6c1de37d5307816c6a3ff',
      name: 'one.jpg',
      addedOn: new Date(),
      timestamp: new Date(),
      mediaType: 'image'
    }, {
      _id: '53c6c1de37d5307816c6a301',
      albumId: '53c6c1de37d5307816c6a3ff',
      name: 'two.jpg',
      addedOn: new Date(),
      timestamp: new Date(),
      mediaType: 'image'
    }, {
      _id: '53c6c1de37d5307816c6a302',
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
      .respond(media);

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
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have received 3 media', function () {
    $httpBackend.flush();
    expect(scope.media.length).toBe(3);
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should not be able to navigate back on the first image.', function () {
    $httpBackend.flush();
    scope.setMedia(0);
    expect(scope.selectedMedia).toEqual(scope.media[0]);

    expect(scope.prevMediaID).toBe(-1);
    expect(scope.hasMediaAtPosition(scope.prevMediaID)).toBe(false);

    expect(scope.nextMediaID).toBe(1);
    expect(scope.hasMediaAtPosition(scope.nextMediaID)).toBe(true);
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should be able to navigate back and forth on the second image.', function () {
    $httpBackend.flush();
    scope.setMedia(1);
    expect(scope.selectedMedia).toEqual(scope.media[1]);

    expect(scope.prevMediaID).toBe(0);
    expect(scope.hasMediaAtPosition(scope.prevMediaID)).toBe(true);

    expect(scope.nextMediaID).toBe(2);
    expect(scope.hasMediaAtPosition(scope.nextMediaID)).toBe(true);
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should not be able to navigate forward on the third image.', function () {
    $httpBackend.flush();
    scope.setMedia(2);
    expect(scope.selectedMedia).toEqual(scope.media[2]);

    expect(scope.prevMediaID).toBe(1);
    expect(scope.hasMediaAtPosition(scope.prevMediaID)).toBe(true);

    expect(scope.nextMediaID).toBe(3);
    expect(scope.hasMediaAtPosition(scope.nextMediaID)).toBe(false);
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should show how many media files are shown on the page.', function() {
    $httpBackend.flush();
    expect(scope.media.length).toBe(3);
  })
});
