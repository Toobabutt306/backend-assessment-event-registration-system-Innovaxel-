import React, { useState, useEffect } from 'react'
import { fetchEvents, cancelReg } from '../services/api'

function CancelReg() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState({ userName: '', eventId: '' })
  const [errors, setErrors] = useState({})
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    fetchEvents(false).then(res => {
      const withRegs = (res.data.data || []).filter(e => e.totalRegistrations > 0)
      setEvents(withRegs)
    }).catch(() => {})
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setConfirm(false)
  }

  function validate() {
    const errs = {}
    if (!form.userName.trim()) errs.userName = 'Name is required'
    if (!form.eventId) errs.eventId = 'Please select an event'
    return errs
  }

  function handleReview(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setConfirm(true)
  }

  async function handleCancel() {
    setLoading(true)
    setConfirm(false)
    try {
      await cancelReg({ userName: form.userName, eventId: form.eventId })
      setMsg({ type: 'success', text: 'Registration cancelled' })
      setForm({ userName: '', eventId: '' })
      const res = await fetchEvents(false)
      const withRegs = (res.data.data || []).filter(e => e.totalRegistrations > 0)
      setEvents(withRegs)
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Could not cancel' })
    } finally {
      setLoading(false)
    }
  }

  const selectedEvent = events.find(e => e.id === form.eventId)

  return (
    <div className="card">
      <h2>Cancel Registration</h2>

      {msg.text && (
        <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleReview} noValidate>
        <div className="form-group">
          <label>Your Name</label>
          <input
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="Name you registered with"
          />
          {errors.userName && <div className="field-error">{errors.userName}</div>}
        </div>

        <div className="form-group">
          <label>Select Event</label>
          {events.length === 0 ? (
            <p style={{ color: '#888', marginTop: '4px', fontSize: '13px' }}>No events with registrations.</p>
          ) : (
            <select name="eventId" value={form.eventId} onChange={handleChange}>
              <option value="">-- Select --</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.eventName} ({ev.eventDate})
                </option>
              ))}
            </select>
          )}
          {errors.eventId && <div className="field-error">{errors.eventId}</div>}
        </div>

        {!confirm && (
          <button className="btn btn-danger" type="submit" disabled={loading}>
            Continue
          </button>
        )}
      </form>

      {confirm && selectedEvent && (
        <div style={{ marginTop: '16px', padding: '14px', background: '#fdf3cd', border: '1px solid #fce8a6', borderRadius: '3px' }}>
          <p style={{ marginBottom: '12px' }}>
            Cancel registration for <strong>{form.userName}</strong> from{' '}
            <strong>{selectedEvent.eventName}</strong>?
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-danger" onClick={handleCancel} disabled={loading}>
              {loading ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
            <button className="btn" style={{ background: '#eee', border: '1px solid #ccc' }} onClick={() => setConfirm(false)}>
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CancelReg
