'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users ;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const randomAppointment = ['[1,3,5]', '[2,4,6]', '[1,3,5,0]', '[3,4,5]', '[1,6,0]']

    await queryInterface.bulkInsert('Trainers', Array.from({ length: 20 }, (a, index) => ({
      name: faker.name.findName(),
      image: `https://loremflickr.com/150/150/human/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      teaching_style: faker.lorem.text(),
      during_time: Math.random() < 0.5 ? 30 : 60,
      location: faker.address.streetAddress(),
      appointment: randomAppointment[Math.floor(Math.random() * randomAppointment.length)],
      user_id: users[index].id,
      created_at: new Date(),
      updated_at: new Date()
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Trainers', {})
  }
}
