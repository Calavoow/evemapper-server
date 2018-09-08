const assert = require('assert');
const app = require('../../src/app');

describe('\'facebook\' service', () => {
  it('registered the service', () => {
    const service = app.service('facebook');

    assert.ok(service, 'Registered the service');
  });
});
