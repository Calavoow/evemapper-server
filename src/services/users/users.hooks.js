const Debug = require('debug');
const debug = Debug('services/users:hooks');
const { authenticate } = require('@feathersjs/authentication').hooks;
const hooks = require('feathers-hooks-common');

const { protect } = require('@feathersjs/authentication-local').hooks;

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [ hooks.disallow('external'), customUser()],
    update: [ hooks.disallow('external') ],
    patch: [ hooks.disallow('external') ],
    remove: [hooks.disallow('external')]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
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

function customUser() {
  return function (context) {
    debug('Customizing user');
    return Promise.resolve(context);
  };
}
