'use strict';

describe('Login test', function() {
  var page;

  it('should have only two menu items when not logged in.', function() {
    browser.get('/');

    var expected = [];
    expected[0] = true;
    expected[1] = false;
    expected[2] = false;
    expected[3] = false;
    expected[4] = false;
    expected[5] = false;
    expected[6] = false;
    expected[7] = false;
    expected[8] = true;
    expected[9] = false;
    expected[10] = false;

    element(by.css('.navbar-nav'))
      .all(by.css('li'))
      .then(function(items) {
        items.forEach(function(item, index) {
          expect(item.isDisplayed()).toBe(expected[index]);
        });
    });
  });

  it('should provide a number of menu items to logged in users.', function() {
    var login = require('./login.po');

    login.doLogin(browser);
    browser.get('/');

    var expected = [];
    expected[0] = false;
    expected[1] = true;
    expected[2] = true;
    expected[3] = true;
    expected[4] = true;
    expected[5] = true;
    expected[6] = true;
    expected[7] = false; // admin
    expected[8] = false;
    expected[9] = true;
    expected[10] = true;

    element(by.css('.navbar-nav'))
      .all(by.css('li'))
      .then(function(items) {
        items.forEach(function(item, index) {
          expect(item.isDisplayed()).toBe(expected[index]);
        });
      });
  });

  it('should provide an additional menu item for admins', function() {
    var login = require('./login.po');

    login.doLoginAdmin(browser);
    browser.get('/');

    var expected = [];
    expected[0] = false;
    expected[1] = true;
    expected[2] = true;
    expected[3] = true;
    expected[4] = true;
    expected[5] = true;
    expected[6] = true;
    expected[7] = true; // admin
    expected[8] = false;
    expected[9] = true;
    expected[10] = true;

    element(by.css('.navbar-nav'))
      .all(by.css('li'))
      .then(function(items) {
        items.forEach(function(item, index) {
          expect(item.isDisplayed()).toBe(expected[index]);
        });
      });
  });
});
