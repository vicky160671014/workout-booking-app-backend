// controller : 接收資料來源及整理回傳結果
const adminController = {
  adminSignIn: (req, res, next) => {
    res.send('POST /api/admin/login')
  },
  adminGetUsers: (req, res, next) => {
    res.send('GET /api/admin')
  }
}

module.exports = adminController
