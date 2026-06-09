const service = require('../services/eventService')

async function createEvent(req, res) {
  const result = await service.createEvent(req.body)
  res.status(result.status).json({ success: result.success, message: result.message, data: result.data || null })
}

async function getEvents(req, res) {
  const upcomingOnly = req.query.upcoming === 'true'
  const result = await service.getEvents(upcomingOnly)
  res.status(result.status).json({ success: result.success, data: result.data })
}

async function registerUser(req, res) {
  const result = await service.registerUser(req.body)
  res.status(result.status).json({ success: result.success, message: result.message, data: result.data || null })
}

async function cancelRegistration(req, res) {
  const result = await service.cancelRegistration(req.body)
  res.status(result.status).json({ success: result.success, message: result.message })
}

module.exports = { createEvent, getEvents, registerUser, cancelRegistration }
