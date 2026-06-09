const { readData, writeData } = require('./dbService')
const { v4: uuidv4 } = require('uuid')

// simple lock to avoid overbooking when requests come at same time
let writing = false

function acquireLock() {
  return new Promise((resolve) => {
    const try_ = () => {
      if (!writing) {
        writing = true
        resolve()
      } else {
        setTimeout(try_, 20)
      }
    }
    try_()
  })
}

function releaseLock() {
  writing = false
}

async function createEvent(body) {
  const { eventName, totalSeats, eventDate } = body

  if (!eventName || !eventName.trim()) {
    return { status: 400, success: false, message: 'Event name is required' }
  }

  const seats = parseInt(totalSeats)
  if (!seats || seats <= 0) {
    return { status: 400, success: false, message: 'Total seats must be greater than 0' }
  }

  if (!eventDate) {
    return { status: 400, success: false, message: 'Event date is required' }
  }

  const dateObj = new Date(eventDate)
  if (isNaN(dateObj.getTime())) {
    return { status: 400, success: false, message: 'Event date is invalid' }
  }

  if (dateObj <= new Date()) {
    return { status: 400, success: false, message: 'Event date must be in the future' }
  }

  await acquireLock()
  try {
    const db = readData()

    const exists = db.events.find(e => e.eventName.toLowerCase() === eventName.trim().toLowerCase())
    if (exists) {
      return { status: 409, success: false, message: 'Event name already exists' }
    }

    const newEvent = {
      id: uuidv4(),
      eventName: eventName.trim(),
      totalSeats: seats,
      availableSeats: seats,
      eventDate: dateObj.toISOString().split('T')[0],
      registrations: []
    }

    db.events.push(newEvent)
    writeData(db)

    return { status: 201, success: true, message: 'Event created', data: newEvent }
  } finally {
    releaseLock()
  }
}

async function getEvents(upcomingOnly) {
  const db = readData()

  let list = db.events.map(e => ({
    id: e.id,
    eventName: e.eventName,
    eventDate: e.eventDate,
    totalSeats: e.totalSeats,
    availableSeats: e.availableSeats,
    totalRegistrations: e.registrations.length
  }))

  if (upcomingOnly) {
    const today = new Date()
    list = list.filter(e => new Date(e.eventDate) > today)
  }

  list.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))

  return { status: 200, success: true, data: list }
}

async function registerUser(body) {
  const { userName, eventId } = body

  if (!userName || !userName.trim()) {
    return { status: 400, success: false, message: 'User name is required' }
  }

  if (!eventId) {
    return { status: 400, success: false, message: 'Event ID is required' }
  }

  await acquireLock()
  try {
    const db = readData()

    const idx = db.events.findIndex(e => e.id === eventId)
    if (idx === -1) {
      return { status: 404, success: false, message: 'Event not found' }
    }

    const event = db.events[idx]

    if (event.availableSeats <= 0) {
      return { status: 400, success: false, message: 'Event is full' }
    }

    const alreadyIn = event.registrations.find(
      r => r.userName.toLowerCase() === userName.trim().toLowerCase()
    )
    if (alreadyIn) {
      return { status: 409, success: false, message: 'User already registered for this event' }
    }

    event.registrations.push({
      userName: userName.trim(),
      registeredAt: new Date().toISOString()
    })
    event.availableSeats -= 1

    db.events[idx] = event
    writeData(db)

    return {
      status: 201,
      success: true,
      message: 'Registration successful',
      data: {
        eventName: event.eventName,
        userName: userName.trim(),
        availableSeats: event.availableSeats
      }
    }
  } finally {
    releaseLock()
  }
}

async function cancelRegistration(body) {
  const { userName, eventId } = body

  if (!userName || !userName.trim()) {
    return { status: 400, success: false, message: 'User name is required' }
  }

  if (!eventId) {
    return { status: 400, success: false, message: 'Event ID is required' }
  }

  await acquireLock()
  try {
    const db = readData()

    const idx = db.events.findIndex(e => e.id === eventId)
    if (idx === -1) {
      return { status: 404, success: false, message: 'Event not found' }
    }

    const event = db.events[idx]

    const regIdx = event.registrations.findIndex(
      r => r.userName.toLowerCase() === userName.trim().toLowerCase()
    )
    if (regIdx === -1) {
      return { status: 404, success: false, message: 'Registration not found' }
    }

    event.registrations.splice(regIdx, 1)
    event.availableSeats += 1

    db.events[idx] = event
    writeData(db)

    return { status: 200, success: true, message: 'Registration cancelled' }
  } finally {
    releaseLock()
  }
}

module.exports = { createEvent, getEvents, registerUser, cancelRegistration }
