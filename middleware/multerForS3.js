const multer = require('multer')
const storage = multer.memoryStorage()
const uploadToS3 = multer({ storage: storage })

module.exports = uploadToS3
