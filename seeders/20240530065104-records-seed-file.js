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

    const records = []

    // 生成user並排除使用過的以及自己
    function getRandomUserRuleOut (usedUsers, userId) {
      let selectedUser
      do {
        selectedUser = users[Math.floor(Math.random() * users.length)]
      } while (usedUsers.includes(selectedUser.id) || selectedUser.id === userId)
      return selectedUser
    }

    // 生成未來record
    for (const t of trainers) {
      const usedUsers = []
      usedUsers.push(t.user_id)
      for (let i = 0; i < 3; i++) {
        const user = getRandomUserRuleOut(usedUsers, t.user_id)
        usedUsers.push(user.id)

        const lessonTime = timeTool.openLessonTime(t.appointment, t.during_time)
        const chooseLessonTime = lessonTime[i + 1]
        records.push({
          user_id: user.id,
          trainer_id: t.id,
          start_time: chooseLessonTime,
          during_time: t.during_time,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }

    // 生成舊record
    let count = 0
    for (const t of trainers) {
      count++
      const usedUsers = []
      usedUsers.push(t.user_id)
      for (let i = 0; i < 2; i++) {
        const user = getRandomUserRuleOut(usedUsers, t.user_id)
        usedUsers.push(user.id)

        const lessonTime = timeTool.openLessonTime(t.appointment, t.during_time)
        const chooseLessonTime = dayjs(lessonTime[i]).subtract(7 + count, 'day').format('YYYY-MM-DD HH:mm')
        records.push({
          user_id: user.id,
          trainer_id: t.id,
          start_time: chooseLessonTime,
          during_time: t.during_time,
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
