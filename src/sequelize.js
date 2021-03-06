const Sequelize = require('sequelize');
const { Op } = Sequelize;
const logger = require('./logger');

module.exports = function (app) {
  const db_config = app.get('database');
  const sequelize = new Sequelize({...db_config, ...{
    logging: false,
    define: {
      freezeTableName: true
    }
  }});
  const oldSetup = app.setup;

  app.set('sequelizeClient', sequelize);

  app.setup = function (...args) {
    const result = oldSetup.apply(this, args);

    // Set up data relationships
    const models = sequelize.models;
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models);
      }
    });

    // Sync to the database
    sequelize.sync({force:false});

    return result;
  };
};
