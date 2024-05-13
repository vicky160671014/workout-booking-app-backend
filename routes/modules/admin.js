const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.post('/signin', adminController.adminSignIn)
router.get('/', adminController.adminGetUsers)

module.exports = router
