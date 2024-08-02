const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const trainerController = require('../controllers/trainer-controller')
const lessonController = require('../controllers/lesson-controller')
const commentController = require('../controllers/comment-controller')
const searchController = require('../controllers/search-controller')
const { authenticated } = require('../middleware/auth')
const { errorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')
const uploadToS3 = require('../middleware/multerForS3')

router.use('/admin', admin)

// user
router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('localStrategyUser', { session: false }), userController.signIn)
// router.get('/users/imageURL', authenticated, userController.getUserImageURL)
router.put('/users/image', authenticated, uploadToS3.single('image'), userController.addUserImageToS3)
router.get('/users/:userId', authenticated, userController.getUser)
router.put('/users/:userId', authenticated, upload.single('image'), userController.putUser)

// trainer
router.post('/trainers/create', authenticated, trainerController.postTrainer)
router.get('/trainers/:trainerId', authenticated, trainerController.getTrainer)
router.put('/trainers/:trainerId', authenticated, upload.single('image'), trainerController.putTrainer)

// lesson
router.get('/lessons/search', authenticated, searchController.getLessons)
router.get('/lessons/:trainerId', authenticated, lessonController.getLesson)
router.get('/lessons', authenticated, lessonController.getLessons)

// record
router.delete('/records/:recordId', authenticated, lessonController.deleteAppointment)
router.post('/records', authenticated, lessonController.postAppointment)

// comment
router.post('/comments', authenticated, commentController.postCommentScore)

router.get('*', (req, res) => res.redirect('/lessons'))

router.use('/', errorHandler)

module.exports = router
