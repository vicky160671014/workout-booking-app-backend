// Services 負責商業邏輯運算
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const { User } = db

const userServices = {
  signUp: async (req, cb) => {
    try {
      const { name, email, password, confirmPassword } = req.body
      if (!name || !email || !password || !confirmPassword) throw new Error('All fields are required')
      if (password !== confirmPassword) throw new Error('Passwords do not match!')

      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('Email already exists!')

      const hash = await bcrypt.hash(password, 10)

      const newUser = await User.create({ name, email, password: hash })
      const newUserToJSON = newUser.toJSON()
      delete newUserToJSON.password
      cb(null, { user: newUserToJSON })
    } catch (error) {
      cb(error)
    }
  },
  signIn: (req, cb) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password // 移除敏感資料
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, { token, user: userData })
    } catch (error) {
      cb(error)
    }
  },
  getUser: async (req, cb) => {
    try {
      const userId = req.user.id
      const user = await User.findByPk(userId, { raw: true })
      if (!user) throw new Error("User didn't exist!")
      delete user.password
      cb(null, { user })
    } catch (error) {
      cb(error)
    }
  }
}

module.exports = userServices
