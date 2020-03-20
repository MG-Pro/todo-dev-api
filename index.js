const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')
const helpers = require('./routes/helpers')
const users = require('./routes/user')
const tasks = require('./routes/tasks')
const jwtStrategy = require('./validation/jwtStrategy')

const app = express()
const port = process.env.PORT || 3000

const dbUrl =
  'mongodb+srv://droneadmin:8APndnqKYshne9A0@cluster0-dmatc.gcp.mongodb.net/todo_app?retryWrites=false'

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../../../build/')))

app.use(passport.initialize())
jwtStrategy(passport)

app.use('/api/users', users)
app.use('/api/tasks', tasks)
app.use('/api/helpers', helpers)

app.listen(port, () => {
  console.log(`Server start on port ${port}!`)
  mongoose
    .connect(dbUrl, { useNewUrlParser: true })
    .then(() => {
      console.log('Database is connected')
    })
    .catch(err => {
      console.log('Can not connect to the database ' + err)
    })
})
