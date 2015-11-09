var Promise    = require('ember-cli/lib/ext/promise');
var CoreObject = require('core-object');
var Hipchatter = require('hipchatter');

module.exports = CoreObject.extend({
  init: function(data) {
    this._super(data);

    this.hipchat = new Hipchatter(this.authToken, this.endpoint);

    this.notify = function(message, color) {
      return new Promise(function(resolve, reject) {
        this.hipchat.notify(this.room, {
          message: message,
          color:   color,
          token:   this.roomNotifyToken
        }, function(err) {
          if (err) { return reject(err); }

          return resolve();
        });
      }.bind(this));
    };
  }
});
