// controller : 接收資料來源及整理回傳結果
const commentServices = require('../services/comment-services')

const commentController = {
  postCommentScore: (req, res, next) => {
    commentServices.postCommentScore(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = commentController
