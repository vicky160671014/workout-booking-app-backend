const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const trainerController = require('../controllers/trainer-controller')
const lessonController = require('../controllers/lesson-controller')
const commentController = require('../controllers/comment-controller')
const searchController = require('../controllers/search-controller')
const { errorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

// user
router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
// router.get('/users/:userId', userController.getUser)
// router.put('/users/:userId', userController.putUser)

// trainer
router.post('/trainers/create', trainerController.postTrainer)
// router.get('/trainers/:trainerId', trainerController.getTrainer)
// router.put('/trainers/:trainerId', trainerController.putTrainer)

// lesson
router.get('/lessons/search', searchController.getLessons)
// router.get('/lessons/:trainerId', lessonController.getLesson)
router.get('/lessons', lessonController.getLessons)

// record
// router.delete('/records/:recordId', lessonController.deleteAppointment)
// router.post('/records', lessonController.postAppointment)

// comment
router.post('/comments', commentController.postCommentScore)

router.get('/', (req, res) => {
  res.send('workout booking app!')
})

router.use('/', errorHandler)

module.exports = router
