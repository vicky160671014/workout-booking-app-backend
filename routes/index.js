const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('workout booking app!')
})

module.exports = router