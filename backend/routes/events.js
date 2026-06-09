const express = require('express')
const router = express.Router()
const controller = require('../controllers/eventController')

router.get('/events', controller.getEvents)
router.post('/events', controller.createEvent)
router.post('/register', controller.registerUser)
router.delete('/cancel', controller.cancelRegistration)

module.exports = router
