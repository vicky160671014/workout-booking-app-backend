// controller : 接收資料來源及整理回傳結果
const searchServices = require('../services/search-services')

const searchController = {
  getLessons: (req, res, next) => {
    searchServices.getLessons(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = searchController
