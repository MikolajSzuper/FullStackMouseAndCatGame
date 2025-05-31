const express = require('express')
const router = express.Router()
const roomController = require('../controllers/roomController')

router.get('/', roomController.getAllRooms)
router.post('/', roomController.createRoom)
router.get('/:id', roomController.getRoom)
router.post('/:id/join', roomController.joinRoom)
router.post('/:id/leave', roomController.leaveRoom)
router.get('/:id/game', roomController.getGame)
router.post('/:id/game', roomController.setGame)
router.post('/:id/result', roomController.setResult)
router.post('/:id/rematch', roomController.rematch)

module.exports = router