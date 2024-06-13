const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User, Admin } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// Set up Passport strategy
// local strategy
passport.use('localStrategyUser', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, cb) => {
  try {
    const user = await User.findOne({ where: { email } })
    if (!user) return cb(new Error('Have not registered'))

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return cb(new Error('Email or password wrong!'))

    user.strategy = 'localStrategyUser'

    return cb(null, user)
  } catch (error) {
    return cb(error)
  }
}))

// local strategy admin
passport.use('localStrategyAdmin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, cb) => {
  try {
    const user = await Admin.findOne({ where: { email } })
    if (!user) return cb(new Error('Email or password wrong!'))

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return cb(new Error('Email or password wrong!'))

    user.strategy = 'localStrategyAdmin'

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

passport.use('localStrategyUserJWT', new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const userData = await User.findByPk(jwtPayload.id)
    if (userData) {
      const user = userData.toJSON()
      delete user.password
      user.strategy = 'localStrategyUser'
      cb(null, user)
    } else {
      cb(null, false)
    }
  } catch (error) {
    cb(error)
  }
}))

passport.use('localStrategyAdminJWT', new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const userData = await Admin.findByPk(jwtPayload.id)
    if (userData) {
      const user = userData.toJSON()
      delete user.password
      user.strategy = 'localStrategyAdmin'
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
  cb(null, { id: user.id, strategy: user.strategy })
})
passport.deserializeUser(async (data, cb) => {
  try {
    if (data.strategy === 'localStrategyUser') {
      const userData = await User.findByPk(data.id)
      const user = userData.toJSON()
      delete user.password
      return cb(null, user)
    } else if (data.strategy === 'localStrategyAdmin') {
      const userData = await Admin.findByPk(data.id)
      const user = userData.toJSON()
      delete user.password
      return cb(null, user)
    }
  } catch (error) {
    cb(error)
  }
})

module.exports = passport
