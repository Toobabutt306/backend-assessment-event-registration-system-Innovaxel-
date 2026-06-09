import React from 'react'
import './Navbar.css'

function Navbar({ page, setPage }) {
  const links = [
    { id: 'events', label: 'All Events' },
    { id: 'create', label: 'Create Event' },
    { id: 'register', label: 'Register' },
    { id: 'cancel', label: 'Cancel Registration' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="navbar-brand">Event Registration</span>
        <ul className="navbar-links">
          {links.map(link => (
            <li key={link.id}>
              <button
                className={page === link.id ? 'active' : ''}
                onClick={() => setPage(link.id)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
