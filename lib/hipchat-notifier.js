/* eslint-env node */

var RSVP       = require('rsvp');
var CoreObject = require('core-object');
var Hipchatter = require('hipchatter');
var _          = require('lodash');

module.exports = CoreObject.extend({
  init: function(data) {
    this._super(data);

    this.hipchat = new Hipchatter(this.authToken, this.endpoint);

    this.notify = function(messageOrOpts, color) {
      if (typeof messageOrOpts === 'string') {
        messageOrOpts = { message: messageOrOpts };
      }

      if (color) {
        messageOrOpts.color = color;
      }

      var options = _.defaults(messageOrOpts, {
        room: this.room,
        token: this.roomNotifyToken
      });

      // Pluck off the room from the optinos.
      var room = options.room;
      delete options.room;

      return new RSVP.Promise(function(resolve, reject) {
        this.hipchat.notify(room, options, function(err) {
          if (err) { return reject(err); }

          return resolve();
        });
      }.bind(this));
    };
  }
});
