'use strict';

var LoginPage = function() {
  this.email = element(by.model('user.email'));
  this.password = element(by.model('user.password'));
  this.button = element(by.id('loginbutton'));
};

LoginPage.prototype.doLogin = function(browser) {
  browser.get('/login');

  this.email.sendKeys('usera@b.c');
  this.password.sendKeys('test');
  this.button.click();

  // Firefox needs this ugly hack:
  // See https://github.com/angular/protractor/issues/480
  browser.actions().mouseDown().mouseUp().perform();
};

LoginPage.prototype.doLoginAdmin = function(browser) {
  browser.get('/login');

  this.email.sendKeys('admin@b.c');
  this.password.sendKeys('test');
  this.button.click();

  // Firefox needs this ugly hack:
  // See https://github.com/angular/protractor/issues/480
  browser.actions().mouseDown().mouseUp().perform();
};

module.exports = new LoginPage();
