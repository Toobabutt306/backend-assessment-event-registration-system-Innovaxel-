import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

export const createEvent = (data) => api.post('/events', data)
export const fetchEvents = (upcoming) => api.get('/events', { params: { upcoming } })
export const registerForEvent = (data) => api.post('/register', data)
export const cancelReg = (data) => api.delete('/cancel', { data })
