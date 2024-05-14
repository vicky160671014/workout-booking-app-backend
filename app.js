const express = require('express')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', routes)

app.listen(port, () => {
  console.info(`workout booking app listening on port ${port}!`)
})

module.exports = app // for test
