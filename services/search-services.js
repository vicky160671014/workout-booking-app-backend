// Services 負責商業邏輯運算
const db = require('../models')
const { Trainer } = db
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { Op } = require('sequelize')

const searchServices = {
  getLessons: async (req, cb) => {
    try {
      if (!req.query.keyword) throw new Error('No keyword, redirect to home page')
      const keyword = req.query.keyword.trim().toLowerCase()
      const DEFAULT_LIMIT = 8
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const findTrainers = await Trainer.findAndCountAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { introduction: { [Op.like]: `%${keyword}%` } },
            { teachingStyle: { [Op.like]: `%${keyword}%` } },
            { location: { [Op.like]: `%${keyword}%` } }
          ]
        },
        limit,
        offset,
        raw: true,
        nest: true
      })

      const trainers = findTrainers.rows.map(t => ({
        ...t,
        introduction: t.introduction && t.introduction.length ? `${t.introduction.substring(0, 50)}...` : '',
        teachingStyle: t.teachingStyle && t.teachingStyle.length ? `${t.teachingStyle.substring(0, 50)}...` : ''
      }))

      cb(null, { trainers, pagination: getPagination(limit, page, findTrainers.count), keyword })
    } catch (error) {
      cb(error)
    }
  }
}

module.exports = searchServices
