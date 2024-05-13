// controller : 接收資料來源及整理回傳結果
const trainerServices = require('../services/trainer-services')

const trainerController = {
  postTrainer: (req, res, next) => {
    trainerServices.postTrainer(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = trainerController
