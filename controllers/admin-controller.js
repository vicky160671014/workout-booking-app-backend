// controller : 接收資料來源及整理回傳結果
const jwt = require('jsonwebtoken')
// const db = require('../models')
// const { User, Trainer, Record, Comment } = db

const adminController = {
  adminSignIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password // 移除敏感資料
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return res.json({ status: 'success', data: { token, userAdmin: userData } })
    } catch (error) {
      next(error)
    }
  },
  adminGetUsers: (req, res, next) => {
    res.send('GET /api/admin')
  }
}

module.exports = adminController
