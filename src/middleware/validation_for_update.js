const { check } = require("express-validator");

exports.validationUpdate = () => [
  check("email_id", "Invalid email").exists().isEmail(),
  check("first_name", "Please provide your first name").exists(),
  check("last_name", "Please provide your last name").exists(),
  check("address", "Please provide address").exists(),
  check("contact_no", "Please provide Contact Number").exists()
];