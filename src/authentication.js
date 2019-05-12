const Debug = require('debug');
const debug = Debug('authentication');
const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');

const oauth2 = require('@feathersjs/authentication-oauth2');
// const FacebookStrategy = require('passport-facebook');
const EveSsoStrategy = require('passport-eveonline-sso');
const CharactersVerifier = require('./services/characters/CharactersVerifier.js');

module.exports = function (app) {
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());

  // app.configure(oauth2(Object.assign({
  //   name: 'facebook',
  //   Strategy: FacebookStrategy
  // }, config.facebook)));

  app.configure(oauth2(Object.assign({
    name: 'evesso',
    Strategy: EveSsoStrategy,
    Verifier: CharactersVerifier
  }, config.evesso)));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });
};
