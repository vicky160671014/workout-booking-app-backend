'use strict'
const timeTool = require('../helpers/time-helpers')
const dayjs = require('dayjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const trainers = await queryInterface.sequelize.query(
      'SELECT id,during_time,appointment,user_id FROM Trainers;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const comments = await queryInterface.sequelize.query(
      'SELECT MIN(id) as id, user_id, trainer_id FROM Comments GROUP BY user_id,trainer_id',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const records = []

    // 生成trainer並排除使用過的以及自己
    function getRandomTrainerRuleOut (usedTrainers, userId) {
      let selectedTrainer
      do {
        selectedTrainer = trainers[Math.floor(Math.random() * trainers.length)]
      } while (usedTrainers.includes(selectedTrainer.id) || selectedTrainer.user_id === userId)
      return selectedTrainer
    }

    // 生成未相依於評論的舊紀錄(comment seed 是運用record生成)
    let count = 1
    for (const user of users) {
      count++
      const usedTrainers = comments.filter(c => c.user_id === user.id).map(c => c.trainer_id)
      for (let i = 0; i < 2; i++) {
        const trainer = getRandomTrainerRuleOut(usedTrainers, user.id)
        usedTrainers.push(trainer.id)

        const lessonTime = timeTool.openLessonTime(trainer.appointment, trainer.during_time)
        const chooseLessonTime = dayjs(lessonTime[i]).subtract(7 * count, 'day').format('YYYY-MM-DD HH:mm')
        records.push({
          user_id: user.id,
          trainer_id: trainer.id,
          start_time: chooseLessonTime,
          during_time: trainer.during_time,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }
    await queryInterface.bulkInsert('Records', records)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Records', {})
  }
}
