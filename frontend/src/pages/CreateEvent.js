import React, { useState } from 'react'
import { createEvent } from '../services/api'

function CreateEvent() {
  const [form, setForm] = useState({ eventName: '', totalSeats: '', eventDate: '' })
  const [errors, setErrors] = useState({})
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  function validate() {
    const errs = {}
    if (!form.eventName.trim()) errs.eventName = 'Event name is required'
    if (!form.totalSeats || parseInt(form.totalSeats) <= 0) errs.totalSeats = 'Must be greater than 0'
    if (!form.eventDate) errs.eventDate = 'Date is required'
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
      await createEvent({
        eventName: form.eventName,
        totalSeats: parseInt(form.totalSeats),
        eventDate: form.eventDate
      })
      setMsg({ type: 'success', text: 'Event created successfully' })
      setForm({ eventName: '', totalSeats: '', eventDate: '' })
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Something went wrong'
      setMsg({ type: 'error', text: errMsg })
    } finally {
      setLoading(false)
    }
  }

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  return (
    <div className="card">
      <h2>Create Event</h2>

      {msg.text && (
        <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Event Name</label>
          <input
            name="eventName"
            value={form.eventName}
            onChange={handleChange}
            placeholder="e.g. Annual Tech Meetup"
          />
          {errors.eventName && <div className="field-error">{errors.eventName}</div>}
        </div>

        <div className="form-group">
          <label>Total Seats</label>
          <input
            type="number"
            name="totalSeats"
            value={form.totalSeats}
            onChange={handleChange}
            placeholder="e.g. 50"
            min="1"
          />
          {errors.totalSeats && <div className="field-error">{errors.totalSeats}</div>}
        </div>

        <div className="form-group">
          <label>Event Date</label>
          <input
            type="date"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
            min={tomorrow}
          />
          {errors.eventDate && <div className="field-error">{errors.eventDate}</div>}
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  )
}

export default CreateEvent
