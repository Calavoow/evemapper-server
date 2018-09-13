const Debug = require('debug');

const debug = Debug('services/characters:verify');
const oauth2 = require('@feathersjs/authentication-oauth2');


class CharactersVerifier extends oauth2.Verifier {
  verify(req, accessToken, refreshToken, profile, done) {
    debug('Checking credentials');
    const options = this.options;
    const query = {
      ['characterOwnerHash']: profile.CharacterOwnerHash, // facebookId: profile.id
      $limit: 1
    };
    const data = { profile, accessToken, refreshToken };
    let existing;

    if (this.service.id === null || this.service.id === undefined) {
      debug('failed: the service.id was not set');
      return done(new Error('the `id` property must be set on the entity service for authentication'));
    }

    // Check request object for an existing entity
    if (req && req[options.entity]) {
      existing = req[options.entity];
    }

    // Check the request that came from a hook for an existing entity
    if (!existing && req && req.params && req.params[options.entity]) {
      existing = req.params[options.entity];
    }

    // If there is already an entity on the request object (ie. they are
    // already authenticated) attach the profile to the existing entity
    // because they are likely "linking" social accounts/profiles.
    if (existing) {
      return this._updateEntity(existing, data)
        .then(entity => this._setPayloadAndDone(entity, done))
        .catch(error => error ? done(error) : done(null, error));
    }

    // Find or create the user since they could have signed up via facebook.
    this.service
      .find({ query })
      .then(this._normalizeResult)
      .then(entity => entity ? this._updateEntity(entity, data) : this._createEntity(data))
      .then(entity => this._setPayloadAndDone(entity, done))
      .catch(error => error ? done(error) : done(null, error));
  }
}

module.exports = CharactersVerifier;
