'use strict';

var AlbumPage = function() {
  this.albums = by.repeater('_set in albums');
  this.albumCount = element.all(this.albums).count();
};

module.exports = new AlbumPage();

