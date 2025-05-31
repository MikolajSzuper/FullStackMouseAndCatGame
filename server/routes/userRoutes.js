const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/me', userController.me)
router.put('/me', userController.updateMe)
router.post('/result', userController.saveResult)
router.get('/stats', userController.stats)

module.exports = router