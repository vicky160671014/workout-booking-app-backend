// Services 負責商業邏輯運算
const db = require('../models')
const { Trainer } = db
const { localFileHandler } = require('../helpers/file-helpers')
const trainerServices = {
  postTrainer: async (req, cb) => {
    const userId = req.user.id
    const image = req.user.image
    const { name, introduction, teachingStyle, duringTime, location, appointment } = req.body
    try {
      if (!userId) throw new Error("User didn't exist!")
      if (!name || !introduction || !teachingStyle || !duringTime || !location || !appointment) throw new Error('All fields are required')
      if (parseInt(duringTime) !== 30 && parseInt(duringTime) !== 60) throw new Error('You can only fill in 30 minutes or 60 minutes')

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
  getTrainer: async (req, cb) => {}
}

module.exports = trainerServices
