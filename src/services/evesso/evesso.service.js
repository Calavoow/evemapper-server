// Initializes the `evesso` service on path `/evesso`
const createService = require('feathers-sequelize');
const createModel = require('../../models/evesso.model');
const hooks = require('./evesso.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/evesso', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('evesso');

  service.hooks(hooks);
};
