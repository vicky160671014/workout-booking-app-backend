const passport = require('../config/passport')
const authenticated = (req, res, next) => {
  passport.authenticate('localStrategyUserJWT', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.user = user // 因傳入callback要自行處理驗證成功時，將user存入req.user
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('localStrategyAdminJWT', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.user = user // 因傳入callback要自行處理驗證成功時，將user存入req.user
    next()
  })(req, res, next)
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
