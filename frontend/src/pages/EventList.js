import React, { useState, useEffect } from 'react'
import { fetchEvents } from '../services/api'

function EventList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [upcomingOnly, setUpcomingOnly] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadEvents()
  }, [upcomingOnly])

  async function loadEvents() {
    setLoading(true)
    setError('')
    try {
      const res = await fetchEvents(upcomingOnly)
      setEvents(res.data.data || [])
    } catch (err) {
      setError('Could not load events. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>Events</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={upcomingOnly}
              onChange={e => setUpcomingOnly(e.target.checked)}
            />
            Upcoming only
          </label>
          <button className="btn btn-primary" onClick={loadEvents} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p style={{ color: '#888', marginTop: '10px' }}>No events found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Total Seats</th>
              <th>Available</th>
              <th>Registered</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map(ev => (
              <tr key={ev.id}>
                <td>{ev.eventName}</td>
                <td>{ev.eventDate}</td>
                <td>{ev.totalSeats}</td>
                <td>{ev.availableSeats}</td>
                <td>{ev.totalRegistrations}</td>
                <td>
                  {ev.availableSeats === 0
                    ? <span className="badge badge-full">Full</span>
                    : <span className="badge badge-open">Open</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default EventList
