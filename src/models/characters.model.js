// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const characters = sequelizeClient.define('characters', {
    characterOwnerHash: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    eveCharacterId: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false
    },
    accessToken: {
      type: DataTypes.STRING
    },
    refreshToken: {
      type: DataTypes.STRING
    },
    expiresIn: {
      type: DataTypes.DATE
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  characters.associate = function (models) {
    models.evesso.belongsTo(models.users);
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return characters;
};
