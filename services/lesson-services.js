// Services 負責商業邏輯運算
const db = require('../models')
const { Trainer, Record } = db
const timeTool = require('../helpers/time-helpers')

const lessonServices = {
  getLessons: (req, cb) => {},
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
  }
}

module.exports = lessonServices
