/*
 * This is only needed in case we use PhantomJS. Without this, RxJS
 * will not work as expected.
 */
if (!Function.prototype.bind) {
  Function.prototype.bind = function (context) {
    var self = this;
    return function () {
      return self.apply(context, arguments);
    };
  };
}
