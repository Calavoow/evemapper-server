const Debug = require('debug');
const debug = Debug('services/characters:hooks');
const {authenticate} = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [setEveSsoContext,
      createAssociatedUser],
    update: [setEveSsoContext,
      authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

/**
 * Set the context data parameters from context.data.evesso.
 * @param context
 * @returns {Promise<*>}
 */
async function setEveSsoContext(context) {
  if (context.data.evesso) {
    debug('EveSSO context available. Setting relevant data fields.');
    // Set the appropriate data fields
    const evesso = context.data.evesso;
    context.data.accessToken = evesso.accessToken;
    context.data.refreshToken = evesso.refreshToken;
    const profile = evesso.profile;
    context.data.eveCharacterId = profile.CharacterID;
    context.data.name = profile.CharacterName;
    context.data.characterOwnerHash = profile.CharacterOwnerHash;
    context.data.expiresOn = profile.ExpiresOn;
  }
  return context;
}

/**
 * Create a user and associate it with the context.data character
 * @param context
 * @returns {Promise<*>}
 */
async function createAssociatedUser(context) {
  // Set the user this character belongs to.
  // TODO: Associate with exisiting user.
  // Create a new user
  const users = context.app.service('users');
  const user = await users.create({name: context.data.name});
  context.data.userId = user.id;

  return context;
}
