/* jshint expr:true */

var expect          = require('chai').expect;
var sinon           = require('sinon');
var Hipchatter      = require('hipchatter');
var HipchatNotifier = require('../../lib/hipchat-notifier.js');

// tokens generated with faker
var AUTH_TOKEN        = 'UBIlRy9Jc2H1igE';
var ROOM_NOTIFY_TOKEN = 'c54X7PCnwQrS7tz';

var ROOM_ID           = '4242424242';
var CUSTOM_ENDPOINT   = 'https://blimmer.hipchat-custom.com';

var hipchatNotify;

describe('HipChat Notifier', function() {
  var hipchat;
  var sandbox;

  beforeEach(function() {
    hipchat = new HipchatNotifier({
      authToken:       AUTH_TOKEN,
      endpoint:        CUSTOM_ENDPOINT,
      room:            ROOM_ID,
      roomNotifyToken: ROOM_NOTIFY_TOKEN,
    });

    sandbox = sinon.sandbox.create();
    hipchatNotify = sandbox.spy(Hipchatter.prototype, 'notify');
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('it can be initialized', function() {
    expect(hipchat).to.be.ok;
    expect(hipchat.authToken).to.equal(AUTH_TOKEN);
    expect(hipchat.endpoint).to.equal(CUSTOM_ENDPOINT);
    expect(hipchat.room).to.equal(ROOM_ID);
    expect(hipchat.roomNotifyToken).to.equal(ROOM_NOTIFY_TOKEN);
  });

  describe('#notify', function() {
    it('is callable', function() {
      expect(typeof(hipchat.notify)).to.equal('function');
    });

    it('sends the correct params to the hipchatter library', function() {
      var message = "a message";
      var color   = "green";

      hipchat.notify(message, color);

      expect(hipchatNotify.calledWith(ROOM_ID, {
        message: message,
        color:   color,
        token:   ROOM_NOTIFY_TOKEN
      })).to.be.ok;
    });

    it('sends correct params with added options provided', function() {
      var message = "a message";
      var color   = "green";
      var room    = "7539";
      var token   = "ds90ab09d8sa09d983kljsaf";
      var format  = "text";

      hipchat.notify({
        message:        message,
        color:          color,
        room:           room,
        token:          token,
        message_format: format
      });

      expect(hipchatNotify.calledWith(room, {
        message:        message,
        color:          color,
        token:          token,
        message_format: format
      })).to.be.ok;
    });

    it('returns a promise', function() {
      var messages = {
          text: "I can haz promises instead of callbacks"
      };

      expect(hipchat.notify(messages).then).to.be.ok;
      expect(hipchat.notify(messages).catch).to.be.ok;
    });


  });
});
