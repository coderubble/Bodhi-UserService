const { check } = require('express-validator/check')

exports.validate = () => {
  return [
    check('user_name', 'Please provide username').exists(),
    check('user_type', 'Please provide valid User Type').exists().isIn(['S', 'C', 'P']),
    check('email_id', 'Invalid email').exists().isEmail(),
    check('contact_no', 'Please provide Contact Number').exists()
  ]
};
