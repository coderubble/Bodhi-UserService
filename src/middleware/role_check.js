const clinic = (req, res, next) => {
  if (req.user.user_type === 'C' || req.user.user_type === 'S') {
    next();
  } else {
    res.sendStatus(401)
  }
}
const system = (req, res, next) => {
  if (req.user.user_type === 'S') {
    next();
  } else {
    res.sendStatus(401)
  }
}
module.exports = { clinic, system }