import React, { useState, useEffect } from 'react'
import { fetchEvents, registerForEvent } from '../services/api'

function Register() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState({ userName: '', eventId: '' })
  const [errors, setErrors] = useState({})
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchEvents(true).then(res => {
      const available = (res.data.data || []).filter(e => e.availableSeats > 0)
      setEvents(available)
    }).catch(() => {})
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  function validate() {
    const errs = {}
    if (!form.userName.trim()) errs.userName = 'Name is required'
    if (!form.eventId) errs.eventId = 'Please select an event'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg({ type: '', text: '' })

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    try {
      await registerForEvent({ userName: form.userName, eventId: form.eventId })
      setMsg({ type: 'success', text: 'Registered successfully' })
      setForm({ userName: '', eventId: '' })
      // refresh the list
      const res = await fetchEvents(true)
      const available = (res.data.data || []).filter(e => e.availableSeats > 0)
      setEvents(available)
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Registration failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Register for Event</h2>

      {msg.text && (
        <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Your Name</label>
          <input
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          {errors.userName && <div className="field-error">{errors.userName}</div>}
        </div>

        <div className="form-group">
          <label>Select Event</label>
          {events.length === 0 ? (
            <p style={{ color: '#888', marginTop: '4px', fontSize: '13px' }}>
              No upcoming events with available seats.
            </p>
          ) : (
            <select name="eventId" value={form.eventId} onChange={handleChange}>
              <option value="">-- Select --</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.eventName} ({ev.eventDate}) - {ev.availableSeats} seats left
                </option>
              ))}
            </select>
          )}
          {errors.eventId && <div className="field-error">{errors.eventId}</div>}
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading || events.length === 0}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}

export default Register
