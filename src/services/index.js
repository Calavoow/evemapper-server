const character = require('./characters/characters.service.js');
const facebook = require('./facebook/facebook.service.js');
const users = require('./users/users.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(character);
  app.configure(facebook);
  app.configure(users);
};
