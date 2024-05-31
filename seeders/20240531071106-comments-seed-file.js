'use strict'
const faker = require('faker')
const timeTool = require('../helpers/time-helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const today = timeTool.currentTaipeiTime()
    // 運用GROUP BY將user_id, trainer_id這兩個欄位相同的紀錄放入同一個分組
    const records = await queryInterface.sequelize.query(
      'SELECT MIN(id) as id, user_id, trainer_id FROM Records WHERE start_time < :todayDate GROUP BY user_id, trainer_id',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        replacements: { todayDate: today }
      }
    )
    const comments = []

    for (const record of records) {
      comments.push({
        user_id: record.user_id,
        trainer_id: record.trainer_id,
        scores: Math.floor(Math.random() * 4) + 1,
        text: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date()
      })
    }

    await queryInterface.bulkInsert('Comments', comments)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
