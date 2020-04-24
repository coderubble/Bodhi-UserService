module.exports.getUser = (function () {
  let user = null;
  return function () {
    if (user === null) {
      user = require('../models/user');
    }
    return user;
  };
})();