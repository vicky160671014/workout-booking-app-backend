// Services 負責商業邏輯運算
const db = require('../models')
const { Trainer, Record, Comment } = db
const { localFileHandler } = require('../helpers/file-helpers')
const timeTool = require('../helpers/time-helpers')
const { Op, Sequelize } = require('sequelize')
const dayjs = require('dayjs')

const trainerServices = {
  postTrainer: async (req, cb) => {
    const userId = req.user.id
    const image = req.user.image
    const { name, introduction, teachingStyle, duringTime, location, appointment } = req.body
    try {
      if (!userId) throw new Error("User didn't exist!")
      if (!name || !introduction || !teachingStyle || !duringTime || !location || !appointment) throw new Error('All fields are required')
      if (parseInt(duringTime) !== 30 && parseInt(duringTime) !== 60) throw new Error('You can only fill in 30 minutes or 60 minutes')
      if (timeTool.weekdayFormatCheck(appointment)) throw new Error('Appointment is wrong format.')

      const user = await Trainer.findOne({ where: { userId } })
      if (user) throw new Error('Already have a trainer status!')

      const newTrainer = await Trainer.create({
        name, introduction, teachingStyle, duringTime, location, appointment, image, userId
      })
      cb(null, { trainer: newTrainer })
    } catch (error) {
      cb(error)
    }
  },
  putTrainer: async (req, cb) => {
    const userId = req.user.id
    const { name, introduction, teachingStyle, duringTime, location, appointment } = req.body
    const { file } = req
    try {
      if (timeTool.weekdayFormatCheck(appointment)) throw new Error('Appointment is wrong format.')
      const trainer = await Trainer.findOne({ where: { userId } })
      if (!trainer) throw new Error("Trainer didn't exist!")

      const filePath = await localFileHandler(file)

      const updatedTrainer = await trainer.update({
        name: name || trainer.name,
        introduction: introduction || trainer.introduction,
        teachingStyle: teachingStyle || trainer.teachingStyle,
        duringTime: duringTime || trainer.duringTime,
        location: location || trainer.location,
        appointment: appointment || trainer.appointment,
        image: filePath || trainer.image
      })

      cb(null, { trainer: updatedTrainer })
    } catch (error) {
      cb(error)
    }
  },
  getTrainer: async (req, cb) => {
    const userId = req.user.id
    try {
      const today = timeTool.currentTaipeiTime()
      const todayAddSevenDays = dayjs(today).add(7, 'day').format('YYYY-MM-DD HH:mm')

      const trainer = await Trainer.findOne({
        where: { userId },
        raw: true
      })
      if (!trainer) throw new Error("Trainer didn't exist!")

      const trainerId = trainer.id
      const [allRecords, currentRecords, allComments, avgCommentScore] = await Promise.all([
        Record.findAll({
          where: { trainerId },
          order: [['startTime', 'ASC']],
          raw: true
        }),
        Record.findAll({
          where: {
            trainerId,
            startTime: {
              [Op.gte]: today,
              [Op.lte]: todayAddSevenDays
            }
          },
          include: [{ model: Trainer }],
          raw: true,
          nest: true
        }),
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
      avgCommentScore.avgScores = parseFloat(avgCommentScore.avgScores).toFixed(1)
      const currentRecordSort = currentRecords.sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime)) // 比較函式<0，a排在b前面

      cb(null, { trainer, allRecords, currentRecordSort, allComments, avgCommentScore })
    } catch (error) {
      cb(error)
    }
  }
}

module.exports = trainerServices
