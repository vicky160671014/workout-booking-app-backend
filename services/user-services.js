// Services 負責商業邏輯運算
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const CustomError = require('../helpers/httpError-helper')
const db = require('../models')
const { User, Trainer, Record, Comment } = db
const { localFileHandler } = require('../helpers/file-helpers')
const timeTool = require('../helpers/time-helpers')
const rankTool = require('../helpers/rank-helper')
const { Op, Sequelize } = require('sequelize')

const userServices = {
  signUp: async (req, cb) => {
    try {
      const { name, email, password, confirmPassword } = req.body
      if (!name || !email || !password || !confirmPassword) throw new CustomError(400, 'All fields are required')
      if (password !== confirmPassword) throw new CustomError(400, 'Passwords do not match!')

      const user = await User.findOne({ where: { email } })
      if (user) throw new CustomError(409, 'Email already exists!')

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
      const today = timeTool.currentTaipeiTime()
      const [user, findNewReservation, findComments, allRanks] = await Promise.all([
        User.findByPk(userId, {
          include: [{ model: Trainer, as: 'isTrainer' }],
          raw: true,
          nest: true
        }),
        Record.findAll({
          where: {
            userId,
            startTime: { [Op.gte]: today }
          },
          include: { model: Trainer },
          raw: true,
          nest: true
        }),
        Comment.findAll({
          where: { userId },
          attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('trainer_id')), 'trainerId']
          ],
          raw: true
        }),
        Record.findAll({
          where: { startTime: { [Op.lt]: today } },
          include: [{ model: User, attributes: ['name', 'image'] }],
          attributes: [
            'user_id',
            [Sequelize.fn('sum', Sequelize.col('during_time')), 'totalTime']
          ],
          group: ['user_id'],
          order: [
            [Sequelize.fn('sum', Sequelize.col('during_time')), 'DESC']
          ],
          raw: true
        })
      ])
      if (!user) throw new CustomError(404, "User didn't exist!")
      delete user.password

      const commentedTrainer = findComments.map(c => c.trainerId)
      const awaitCommentRecord = await Record.findAll({
        where: {
          userId,
          startTime: { [Op.lt]: today },
          trainerId: { [Op.notIn]: commentedTrainer }
        },
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('trainer_id')), 'trainerId']
        ],
        include: { model: Trainer, attributes: ['name', 'image'] },
        raw: true,
        nest: true
      })

      const newReservation = findNewReservation.sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime))

      const myRankIndex = rankTool.myRank(userId, allRanks)
      cb(null, { user, newReservation, awaitCommentRecord, myRankIndex })
    } catch (error) {
      cb(error)
    }
  },
  putUser: async (req, cb) => {
    const userId = req.user.id
    const { name, introduction } = req.body
    const { file } = req
    try {
      if (!name) throw new CustomError(400, 'User name is required!')
      if (Number(userId) !== Number(req.params.userId)) throw new CustomError(403, 'Error, you can only modify your own information')
      const [user, filePath] = await Promise.all([User.findByPk(userId), localFileHandler(file)])
      if (!user) throw new CustomError(404, "User didn't exist!")

      const updatedUser = user.update({
        name: name || user.name,
        image: filePath || user.image,
        introduction: introduction || user.introduction
      })
      cb(null, { user: updatedUser })
    } catch (error) {
      cb(error)
    }
  }
}

module.exports = userServices
