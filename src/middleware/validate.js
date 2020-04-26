const { check } = require("express-validator");

exports.validate = () => [
  check("email_id", "Invalid email").exists().isEmail(),
  check("first_name", "Please provide your first name").exists(),
  check("last_name", "Please provide your first name").exists(),
  check("user_type", "Please provide valid User Type").exists().isIn(["S", "C", "P"]),
  check("address", "Please provide address").exists(),
  check("contact_no", "Please provide Contact Number").exists()
];