# Event Registration System

A simple event registration API with a React frontend.

## Project Structure

```
event-registration-system/
  backend/
    controllers/
      eventController.js
    routes/
      events.js
    services/
      dbService.js
      eventService.js
    data/
      events.json
    server.js
    package.json
  frontend/
    public/
      index.html
    src/
      components/
        Navbar.js
        Navbar.css
      pages/
        CreateEvent.js
        EventList.js
        Register.js
        CancelReg.js
      services/
        api.js
      App.js
      App.css
      index.js
      index.css
    package.json
```

## Setup

You need Node.js v16+ installed.

### Backend

```bash
cd backend
npm install
npm start
```

Runs on http://localhost:5000

### Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Opens at http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/events | Create event |
| GET | /api/events | Get all events |
| GET | /api/events?upcoming=true | Get upcoming events |
| POST | /api/register | Register user |
| DELETE | /api/cancel | Cancel registration |

## Notes

- Data is stored in `backend/data/events.json`
- The file is created automatically on first run
- No database setup needed
