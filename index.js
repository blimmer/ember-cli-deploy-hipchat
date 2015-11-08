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
        didDeploy: function() {
          return function(hipchat) {
            return hipchat.notify(
              "Deployment finished! New revision was successfully uploaded.",
              'green'
            );
          };
        },

        didFail: function() {
          return function(hipchat) {
            return hipchat.notify(
              "Deployment failed.",
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
      }
    });
    return new DeployPlugin();
  }
};
