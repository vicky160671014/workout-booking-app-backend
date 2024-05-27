// Services 負責商業邏輯運算
const db = require('../models')
const { Record, Comment } = db
const timeTool = require('../helpers/time-helpers')
const { Op } = require('sequelize')

const commentServices = {
  postCommentScore: async (req, cb) => {
    const today = timeTool.currentTaipeiTime()
    const userId = req.user.id
    const { trainerId, scores, text } = req.body
    try {
      if (!trainerId || !scores || !text) throw new Error('All fields are required')
      if (parseInt(scores) > 5 || parseInt(scores) < 1) throw new Error('Please fill in the score from 1 to 5 points')

      const record = await Record.findAll({ where: { trainerId, userId, startTime: { [Op.lt]: today } }, raw: true })
      if (record.length === 0) throw new Error('User has no record of this trainer')

      const newComment = await Comment.create({
        scores,
        text,
        userId,
        trainerId
      })
      cb(null, { comment: newComment })
    } catch (error) {
      cb(error)
    }
  }
}

module.exports = commentServices
