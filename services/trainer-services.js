// Services 負責商業邏輯運算
const db = require('../models')
const { Trainer } = db
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
  }
}

module.exports = trainerServices
