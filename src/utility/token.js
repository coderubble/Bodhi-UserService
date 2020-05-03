const jwt = require("jsonwebtoken");
const decode_token = function (token, callback) {
  const result = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
  callback(result);
};
const generateAuthToken = function ({ email_id, user_type, clinic_id }) {
  return jwt.sign({ email_id, user_type, clinic_id }, process.env.JWT_PRIVATE_KEY, { expiresIn: "1h" });
};

module.exports = { decode_token, generateAuthToken };
