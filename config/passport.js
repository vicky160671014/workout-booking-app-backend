const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// Set up Passport strategy
// local strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, cb) => {
  try {
    const user = await User.findOne({ where: { email } })
    if (!user) return cb(new Error('Have not registered'))

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return cb(new Error('Email or password wrong!'))

    return cb(null, user)
  } catch (error) {
    return cb(error)
  }
}))
// JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const userData = await User.findByPk(jwtPayload.id)
    if (userData) {
      const user = userData.toJSON()
      delete user.password
      cb(null, user)
    } else {
      cb(null, false)
    }
  } catch (error) {
    cb(error)
  }
}))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  try {
    const userData = await User.findByPk(id)
    const user = userData.toJSON()
    delete user.password
    cb(null, user)
  } catch (error) {
    cb(error)
  }
})

module.exports = passport
