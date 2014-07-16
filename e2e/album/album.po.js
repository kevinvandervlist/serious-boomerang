'use strict';

var AlbumPage = function() {
  this.albums = by.repeater('_set in albums');
  this.albums_2014 = element(this.albums.row(0));
  this.albums_2010 = element(this.albums.row(1));
  this.albumCount = element.all(this.albums).count();
  //console.log(this.albumCount);
  console.log(element.all(this.albums).count());
  /*
   this.heroEl = element(by.css('.hero-unit'));
   this.h1El = this.heroEl.element(by.css('h1'));
   this.imgEl = this.heroEl.element(by.css('img'));
   this.anchorEl = this.heroEl.element(by.css('a'));

   this.repeater = by.repeater('thing in awesomeThings');
   this.firstAwesomeThingNameEl = element(this.repeater.row(0).column('{{thing.name}}'));
   this.awesomeThingsCount = element.all(this.repeater).count();
   */
};

module.exports = new AlbumPage();

