// controller : 接收資料來源及整理回傳結果
const lessonServices = require('../services/lesson-services')

const lessonController = {
  getLessons: (req, res, next) => {
    lessonServices.getLessons(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postAppointment: (req, res, next) => {
    lessonServices.postAppointment(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = lessonController
