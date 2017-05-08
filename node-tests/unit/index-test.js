/* jshint expr:true */

var expect          = require('chai').expect;
var sinon           = require('sinon');
var RSVP            = require('rsvp');

// tokens generated with faker
var AUTH_TOKEN        = 'UBIlRy9Jc2H1igE';
var ROOM_NOTIFY_TOKEN = 'c54X7PCnwQrS7tz';
var ROOM_ID           = '4242424242';
var PROJECT_NAME      = 'myapp';

describe('index', function() {
  var subject, sandbox;

  beforeEach(function() {
    subject = require('../../index');
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('has a name', function() {
    var result = subject.createDeployPlugin({
      name: 'test-plugin'
    });

    expect(result.name).to.equal('test-plugin');
  });

  it('implements the correct hooks', function() {
    var plugin = subject.createDeployPlugin({
      name: 'test-plugin'
    });

    expect(plugin.configure).to.be.a.function;
    expect(plugin.willDeploy).to.be.a.function;
    expect(plugin.willBuild).to.be.a.function;
    expect(plugin.build).to.be.a.function;
    expect(plugin.didBuild).to.be.a.function;
    expect(plugin.willUpload).to.be.a.function;
    expect(plugin.upload).to.be.a.function;
    expect(plugin.didUpload).to.be.a.function;
    expect(plugin.willActivate).to.be.a.function;
    expect(plugin.activate).to.be.a.function;
    expect(plugin.didActivate).to.be.a.function;
    expect(plugin.displayRevisions).to.be.a.function;
    expect(plugin.didDeploy).to.be.a.function;
    expect(plugin.didFail).to.be.a.function;
  });

  describe('default pipeline hooks', function() {
    var plugin, notifyStub, context;
    beforeEach(function() {
      plugin = subject.createDeployPlugin({
        name: 'hipchat'
      });

      notifyStub = sandbox.stub().returns(RSVP.resolve());

      context = {
        deployTarget: 'production',
        ui: sandbox.mock,
        config: {
          "hipchat": {
            authToken:       AUTH_TOKEN,
            room:            ROOM_ID,
            roomNotifyToken: ROOM_NOTIFY_TOKEN,
            hipchatNotifier: {
              notify: notifyStub
            }
          }
        },
        project: {
          name: function() {
            return PROJECT_NAME;
          }
        }
      };

      plugin.beforeHook(context);
      plugin.configure(context);
    });

    describe('didDeploy', function() {
      it('notifies hipchat', function(done) {
        plugin.didDeploy(context).then(function() {
          expect(notifyStub.withArgs('Deployment of myapp to production target finished.', 'green').calledOnce).to.be.true;
          done();
        }).catch(function(error) {
          done(error.stack);
        });
      });
    });
    describe('didActivate', function() {
      it('notifies hipchat', function(done) {
        plugin.didActivate(context).then(function() {
          expect(notifyStub.withArgs('Activation of myapp to production target finished.', 'green').calledOnce).to.be.true;
          done();
        }).catch(function(error) {
          done(error.stack);
        });
      });
    });
    describe('didFail', function() {
      it('notifies hipchat', function(done) {
        plugin.didFail(context).then(function() {
          expect(notifyStub.withArgs('Deployment of myapp to production target failed.', 'red').calledOnce).to.be.true;
          done();
        }).catch(function(error) {
          done(error.stack);
        });
      });
    });
  });

  describe('_getHumanDeployMessage', function() {
    var plugin, context;
    beforeEach(function() {
      plugin = subject.createDeployPlugin({
        name: 'hipchat'
      });

      context = {
        deployTarget: 'production',
        ui: sandbox.mock,
        config: {
          "hipchat": {
            authToken:       AUTH_TOKEN,
            room:            ROOM_ID,
            roomNotifyToken: ROOM_NOTIFY_TOKEN,
            hipchatNotifier: {

            }
          }
        },
        project: {
          name: function() {
            return PROJECT_NAME;
          }
        }
      };
    });

    it('produces a human readable message', function() {
      expect(plugin._getHumanDeployMessage(context)).to.equal('myapp to production target');
    });

    it('includes the revisionKey when present (deploy)', function() {
      var revisionKey = 'D34DB33F';
      context.revisionData = {
        revisionKey: revisionKey
      };

      expect(plugin._getHumanDeployMessage(context)).to.equal('myapp revision ' + revisionKey + ' to production target');
    });

    it('includes the revisionKey when present (activation)', function() {
      var revisionKey = 'D34DB33F';
      context.revisionData = {
        activatedRevisionKey: revisionKey
      };

      expect(plugin._getHumanDeployMessage(context)).to.equal('myapp revision ' + revisionKey + ' to production target');
    });
  });
});
