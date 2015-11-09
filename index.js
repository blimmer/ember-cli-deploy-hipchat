/* jshint node: true */
'use strict';

var DeployPluginBase = require('ember-cli-deploy-plugin');
var HipchatNotifier  = require('./lib/hipchat-notifier');

module.exports = {
  name: 'ember-cli-deploy-hipchat',

  createDeployPlugin: function(options) {
    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,
      requiredConfig: ['authToken', 'room', 'roomNotifyToken'],
      defaultConfig: {
        didDeploy: function(context) {
          return function(hipchat) {
            var message = "Deployment of " + this._getHumanDeployMessage(context) + " finished.";

            return hipchat.notify(
              message,
              'green'
            );
          };
        },

        didActivate: function(context) {
          return function(hipchat) {
            var message = "Activation of " + this._getHumanDeployMessage(context) + " finished.";

            return hipchat.notify(
              message,
              'green'
            );
          };
        },

        didFail: function(context) {
          var message = "Deployment of " + this._getHumanDeployMessage(context) + " failed.";

          return function(hipchat) {
            return hipchat.notify(
              message,
              'red'
            );
          };
        }
      },

      willDeploy: function( /* context */ ) {
        return this._executeHipchatNotificationHook('willDeploy');
      },

      willBuild: function( /* context */ ) {
        return this._executeHipchatNotificationHook('willBuild');
      },

      build: function( /* context */ ) {
        return this._executeHipchatNotificationHook('build');
      },

      didBuild: function( /* context */ ) {
        return this._executeHipchatNotificationHook('didBuild');
      },

      willUpload: function( /* context */ ) {
        return this._executeHipchatNotificationHook('willUpload');
      },

      upload: function( /* context */ ) {
        return this._executeHipchatNotificationHook('upload');
      },

      didUpload: function( /* context */ ) {
        return this._executeHipchatNotificationHook('didUpload');
      },

      willActivate: function( /* context */ ) {
        return this._executeHipchatNotificationHook('willActivate');
      },

      activate: function( /* context */ ) {
        return this._executeHipchatNotificationHook('activate');
      },

      didActivate: function( /* context */ ) {
        return this._executeHipchatNotificationHook('didActivate');
      },

      didDeploy: function( /* context */ ) {
        return this._executeHipchatNotificationHook('didDeploy');
      },

      didFail: function( /* context */ ) {
        return this._executeHipchatNotificationHook('didFail');
      },
      _executeHipchatNotificationHook: function(hookName) {
        var hipchat = this._initHipchatNotifier();
        var hipchatHook = this.readConfig(hookName);
        if (hipchatHook) {
          return hipchatHook.call(this, hipchat);
        }
      },
      _initHipchatNotifier: function() {
        // required
        var authToken       = this.readConfig('authToken');
        var room            = this.readConfig('room');
        var roomNotifyToken = this.readConfig('roomNotifyToken');

        // optional
        var endpoint        = this.readConfig('endpoint');

        return this.readConfig('hipchatNotifier') || new HipchatNotifier({
          authToken:       authToken,
          endpoint:        endpoint,
          room:            room,
          roomNotifyToken: roomNotifyToken,
        });
      },
      _getHumanDeployMessage: function(context) {
        var revision;
        if (context.revisionData) {
          revision = context.revisionData['revisionKey'] || context.revisionData['activatedRevisionKey'];
        }

        var projectName = context.project.name();

        var message;
        if (revision) {
          message = projectName + ' revision ' + revision;
        } else {
          message = projectName;
        }

        return message + " to " + context.deployTarget + " target";
      }
    });
    return new DeployPlugin();
  }
};
