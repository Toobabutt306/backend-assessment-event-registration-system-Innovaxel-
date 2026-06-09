import React, { useState } from 'react'
import Navbar from './components/Navbar'
import EventList from './pages/EventList'
import CreateEvent from './pages/CreateEvent'
import Register from './pages/Register'
import CancelReg from './pages/CancelReg'
import './App.css'

function App() {
  const [page, setPage] = useState('events')

  function renderPage() {
    if (page === 'events') return <EventList />
    if (page === 'create') return <CreateEvent />
    if (page === 'register') return <Register />
    if (page === 'cancel') return <CancelReg />
    return <EventList />
  }

  return (
    <div>
      <Navbar page={page} setPage={setPage} />
      <div className="page-content">
        {renderPage()}
      </div>
    </div>
  )
}

export default App
