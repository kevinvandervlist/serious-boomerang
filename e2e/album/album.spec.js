'use strict';

describe('Album View', function() {
  var page;

  beforeEach(function() {
    //var login = require('../account/login/login.po');
    //login.doLogin(browser);

    browser.get('/album');
    page = require('./album.po');
  });

  it('should have 2 sets af albums (grouped by year)', function() {
    expect(page.albumCount).toBe(2);
  });

  it('should have 2014 as the first album', function() {
    element.all(by.css('.albumyear')).then(function(items) {
      expect(items[0].getText()).toBe('2014');
    });
  });

  it('should have 2010 as the second album', function() {
    element.all(by.css('.albumyear')).then(function(items) {
      expect(items[1].getText()).toBe('2010');
    });
  });
});
