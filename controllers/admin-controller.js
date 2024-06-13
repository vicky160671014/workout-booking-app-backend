// controller : 接收資料來源及整理回傳結果
const jwt = require('jsonwebtoken')
const db = require('../models')
const { User, Trainer } = db
const { getOffset, getPagination } = require('../helpers/pagination-helper')

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
  adminGetUsers: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 3
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const findAllUsers = await User.findAndCountAll({
        include: { model: Trainer, as: 'isTrainer' },
        attributes: ['id', 'name', 'email', 'image', 'introduction'],
        limit,
        offset,
        raw: true,
        nest: true
      })

      return res.json({ status: 'success', data: { users: findAllUsers, pagination: getPagination(limit, page, findAllUsers.count) } })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
