const assert = require('assert');
const app = require('../../src/app');

describe('\'evesso\' service', () => {
  it('registered the service', () => {
    const service = app.service('evesso');

    assert.ok(service, 'Registered the service');
  });
});
