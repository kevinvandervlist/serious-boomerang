'use strict';

var LoginPage = function() {
  this.email = element(by.model('user.email'));
  this.password = element(by.model('user.password'));
  this.button = element(by.id('loginbutton'));
};

LoginPage.prototype.doLogin = function(browser) {
  this.email.sendKeys('usera@b.c');
  this.password.sendKeys('test');
  this.button.click();
  // Firefox needs this ugly hack:
  browser.actions().mouseDown().mouseUp().perform();

};

module.exports = new LoginPage();
