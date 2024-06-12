// Services 負責商業邏輯運算
const db = require('../models')
const { Trainer, Record, Comment, User } = db
const timeTool = require('../helpers/time-helpers')
const rankTool = require('../helpers/rank-helper')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { Op, Sequelize } = require('sequelize')
const dayjs = require('dayjs')

const lessonServices = {
  getLessons: async (req, cb) => {
    try {
      const today = timeTool.currentTaipeiTime()
      const DEFAULT_LIMIT = 8
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const [findTrainers, findUserRecord] = await Promise.all([
        Trainer.findAndCountAll({
          limit,
          offset,
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
          limit: 10,
          raw: true
        })
      ])

      const trainers = findTrainers.rows.map(t => ({
        ...t,
        introduction: t.introduction && t.introduction.length ? `${t.introduction.substring(0, 50)}...` : '',
        teachingStyle: t.teachingStyle && t.teachingStyle.length ? `${t.teachingStyle.substring(0, 50)}...` : ''
      }))

      const userRecordRank = rankTool.addRankIndex(findUserRecord)

      cb(null, { trainers, userRecordRank, pagination: getPagination(limit, page, findTrainers.count) })
    } catch (error) {
      cb(error)
    }
  },
  getLesson: async (req, cb) => {
    try {
      const { trainerId } = req.params
      const todayAddOne = dayjs(timeTool.currentTaipeiTime()).add(1, 'day').format('YYYY-MM-DD')
      const [trainer, findRecord, allComments, avgCommentScore] = await Promise.all([
        Trainer.findByPk(trainerId, { raw: true }),
        Record.findAll({
          where: {
            trainerId,
            startTime: { [Op.gte]: todayAddOne }
          },
          raw: true
        }) || [],
        Comment.findAll({
          where: { trainerId },
          order: [['scores', 'DESC']],
          raw: true
        }),
        Comment.findOne({
          where: { trainerId },
          attributes: [
            [Sequelize.fn('AVG', Sequelize.col('scores')), 'avgScores']
          ],
          raw: true
        })
      ])

      if (!trainer) throw new Error("Trainer didn't exist!")

      // 計算目前此教練可以被預約的時間
      const bookedRecord = findRecord.map(r => r.startTime)
      if (typeof (trainer.appointment) !== 'object') {
        const newArray = []
        newArray.push(trainer.appointment)
        trainer.appointment = newArray
      }
      trainer.availableReserveTime = timeTool.availableReserve(trainer.appointment, bookedRecord, trainer.duringTime)
      // 最佳評論、最差評論、平均分數
      avgCommentScore.avgScores = parseFloat(avgCommentScore.avgScores).toFixed(1)
      const highComment = allComments[0]
      const lowComment = allComments.length > 1 ? allComments[allComments.length - 1] : null

      cb(null, { trainer, highComment, lowComment, avgCommentScore })
    } catch (error) {
      cb(error)
    }
  },
  postAppointment: async (req, cb) => {
    const userId = req.user.id
    const { trainerId, appointment } = req.body
    const startTime = timeTool.appointmentFormat(appointment)
    try {
      if (!trainerId || !appointment) throw new Error('All fields are required')

      const [trainer, userRecord, trainerRecord] = await Promise.all([
        Trainer.findByPk(trainerId, { raw: true }),
        Record.findAll({ where: { userId }, raw: true }),
        Record.findAll({ where: { trainerId }, raw: true })
      ])
      // 前端資料驗證
      if (!trainer) throw new Error("Trainer didn't exist!")
      if (parseInt(trainer.userId) === parseInt(userId)) throw new Error("Unable to book a trainer's own lesson")
      if (!timeTool.startTimeAvailable(startTime, trainer.appointment)) throw new Error('Not open during this week day')
      // 確認此預約是否與trainer的其他user預約重複(同trainer)
      if (timeTool.bookedCheck(startTime, trainerRecord)) throw new Error('This time slot has been reserved')
      // 確認此預約是否與user自己的其他預約重複(同user)
      if (timeTool.userOverlappingCheck(startTime, trainer.duringTime, userRecord)) throw new Error('User appointments overlap')

      // 創建新預約
      const newRecord = await Record.create({
        startTime,
        duringTime: trainer.duringTime,
        userId,
        trainerId: trainer.id
      })
      cb(null, { record: newRecord })
    } catch (error) {
      cb(error)
    }
  },
  deleteAppointment: async (req, cb) => {
    const userId = req.user.id
    const { recordId } = req.params
    try {
      const record = await Record.findByPk(recordId)
      if (!record) throw new Error("Record didn't exist!")
      if (record.userId !== userId) throw new Error("Unable to delete other user's record!")

      const deleteRecord = await record.destroy()
      cb(null, { deleteRecord })
    } catch (error) {
      cb(error)
    }
  }
}

module.exports = lessonServices
