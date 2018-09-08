const {authenticate} = require('@feathersjs/authentication').hooks;
const console = require('console');

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [customizeEveSSO()],
    update: [customizeEveSSO(),
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

function customizeEveSSO() {
  return function (context) {
    console.log('Customizing EVE Profile');
    // If there is a github field they signed up or
    // signed in with github so let's pull the primary account email.
    if (context.data.github) {
      context.data.email = context.data.github.profile.emails.find(email => email.primary).value;
    }

    // If you want to do something whenever any OAuth
    // provider authentication occurs you can do this.
    if (context.params.oauth) {
      // do something for all OAuth providers
    }

    if (context.params.oauth.provider === 'github') {
      // do something specific to the github provider
    }

    return Promise.resolve(context);
  };
}
