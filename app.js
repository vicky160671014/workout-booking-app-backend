if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const path = require('path')
const express = require('express')
const methodOverride = require('method-override')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use('/api', routes)

app.listen(port, () => {
  console.info(`workout booking app listening on port ${port}!`)
})

module.exports = app // for test
