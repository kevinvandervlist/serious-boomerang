'use strict';

describe('Login test', function() {
  var page;
return;
  beforeEach(function() {
    browser.get('/');
    page = require('./album.po');
  });

  it('should have 2 sets af albums (grouped by year)', function() {
    expect(page.albumCount).toBe(2);
  });

  it('should have 2010 as the first album', function() {
    console.log(this.albums_2014);
    expect(this.albums_2014.getText()).toBe('2010');
  });

  it('should include jumbotron with correct data', function() {
    expect(page.h1El.getText()).toBe('\'Allo, \'Allo!');
    expect(page.imgEl.getAttribute('src')).toMatch(/assets\/images\/yeoman.png$/);
    expect(page.imgEl.getAttribute('alt')).toBe('I\'m Yeoman');
  });

  it('should render awesomeThings', function() {
    expect(page.firstAwesomeThingNameEl.getText()).toContain('Development Tools');
    page.awesomeThingsCount.then(function(count) {
      expect(count).toBe(6);
    });
  });
});
