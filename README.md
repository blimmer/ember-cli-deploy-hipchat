# ember-cli-deploy-hipchat [![Build Status](https://travis-ci.org/blimmer/ember-cli-deploy-hipchat.svg?branch=master)](https://travis-ci.org/blimmer/ember-cli-deploy-hipchat)

> An ember-cli-deploy-plugin for sending deployment messages to [HipChat](https://www.hipchat.com/).

<hr/>
**WARNING: This plugin is only compatible with ember-cli-deploy versions >= 0.5.0**
<hr/>

## What is an ember-cli-deploy plugin?

A plugin is an addon that can be executed as a part of the ember-cli-deploy pipeline. A plugin will implement one or more of the ember-cli-deploy's pipeline hooks.

For more information on what plugins are and how they work, please refer to the [Plugin Documentation][2].

## Quick Start

To get up and running quickly, do the following:

- Install this plugin

```bash
$ ember install ember-cli-deploy-hipchat
```

- Create an [authToken](https://hipchat.com/account/api) in HipChat with the `Send Notification` permission.

- Create a roomNotifyToken in HipChat. You can generate one by going to HipChat.com > Rooms tab > Click the room you want > Tokens on the left-hand side > generate a new token with the `Send Notification` scope.

- Identify the Room API ID. You can identify this by going to HipChat.com > Rooms tab > Click the room you want > Summary on the left-hand side > API ID in the table.

- Place the following configuration into `config/deploy.js`

```javascript
ENV.hipchat = {
  authToken:       '<your-authToken>',
  roomNotifyToken: '<your-roomNotifyToken>',
  room:            '<your-roomId>'
}
```

If you use a custom HipChat domain, include it in the configuration.

```javascript
ENV.hipchat = {
  authToken:       '<your-authToken>',
  roomNotifyToken: '<your-roomNotifyToken>',
  room:            '<your-roomId>',
  endpoint:        '<your-custom-endpoint>'
}
```

- Run the pipeline

```bash
$ ember deploy
```

## ember-cli-deploy Hooks Implemented

For detailed information on what plugin hooks are and how they work, please refer to the [Plugin Documentation][2].

- `configure`
- `willDeploy`
- `willBuild`
- `build`
- `didBuild`
- `willUpload`
- `upload`
- `didUpload`
- `willActivate`
- `activate`
- `didActivate`
- `didDeploy`
- `didFail`

## Configuration Options

For detailed information on how configuration of plugins works, please refer to the [Plugin Documentation][2].

###authToken

The [authToken](https://hipchat.com/account/api) to use to auth with HipChat.

###roomNotifyToken

A token for the room you want to notify in HipChat.
You can generate one by going to HipChat.com > Rooms tab > Click the room you want > Tokens on the left-hand side > generate a new token with the `Send Notification` scope.

###room

The Room API ID.
You can identify this by going to HipChat.com > Rooms tab > Click the room you want > Summary on the left-hand side > API ID in the table. You (supposedly) can also use the room name, but the
ID is safer.

###endpoint (optional)

If you host your own HipChat server, enter the API V2 endpoint for your setup.

## Customization

`ember-cli-deploy-hipchat` will send default messages on the `didDeploy`-,
`didActivate`- and `didFail`-hooks on the pipeline.
Because every team is different and people tend to customize their automatic
hipchat notifications messages can be customized.

To customize a message you simply add a function to your hipchat configuration
options that is named the same as the hook notification you want to customize:

```js
ENV.hipchat = {
  authToken:       '<your-authToken>',
  roomNotifyToken: '<your-roomNotifyToken>',
  room:            '<your-roomId>',
  didDeploy: function(context) {
    return function(hipchat) {
      return hipchat.notify('w00t I can haz customizations!', 'yellow');
    };
  }
}
```

Notification hooks will be passed the deployment context and the hipchatNotifier
utility class. The HipchatNotifier uses [hipchatter](https://github.com/charltoons/hipchatter) under the hood so you can use its `notify`-function accordingly.

Because of the way `ember-cli-deploy` merges return values of hooks back into the deployment context, you can easily add custom properties to the deployment context if that's what you need to do:

```javascript
ENV.hipchat = {
  authToken:       '<your-authToken>',
  roomNotifyToken: '<your-roomNotifyToken>',
  room:            '<your-roomId>',

  didDeploy: function(context) {
    return function(hipchat) {
      var myCustomLogic = something;
      var message = "I deployed with " + myCustomLogic + " extra info!";

      return hipchat.notify(message, 'green');
    };
  }
}
```

## Running Tests

- `npm test`

[2]: http://ember-cli.github.io/ember-cli-deploy/plugins "Plugin Documentation"
