# Live Code Classroom

A real-time coding classroom where mentors observe students solving JavaScript exercises. Built with React, Express, MongoDB, Socket.IO, and Monaco Editor.

## How It Works

1. A mentor creates a session by opening a code block
2. Students join the same code block and write their solution
3. The mentor sees every keystroke in real-time (read-only view)
4. Students can check their solution against the expected answer
5. When the mentor leaves, students are notified and redirected

**Role assignment:** The first person to open a code block becomes the mentor. Everyone else joins as a student.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, MUI |
| Code Editor | Monaco Editor (VS Code engine) |
| Backend | Express, Node.js |
| Database | MongoDB + Mongoose |
| Real-time | Socket.IO |
| Dev Environment | Docker Compose |

## Quick Start

### With Docker Compose
```bash
docker compose up
```
Then visit http://localhost:5173

### Manual Setup
```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run seed   # populate code blocks
npm run dev

# Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/live-code-classroom` |
| `ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_SERVER_URL` | Backend URL | `http://localhost:3001` |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config.js              # Centralized env config
│   │   ├── server.js              # HTTP + Socket.IO server
│   │   ├── app.js                 # Express app, routes, middleware
│   │   ├── models/                # Mongoose models
│   │   ├── controllers/           # Route handlers
│   │   ├── routes/                # Express routes
│   │   ├── services/              # Socket.IO room logic
│   │   ├── socket/                # Socket.IO connection handler
│   │   └── middleware/            # Error handler
│   └── scripts/seed.js            # Database seed script
├── frontend/
│   └── src/
│       ├── pages/                 # LobbyPage, CodeRoomPage
│       ├── components/ui/         # CodeEditor (Monaco wrapper)
│       ├── components/layout/     # AppShell
│       ├── services/              # API calls
│       ├── contexts/              # ThemeContext
│       ├── types/                 # TypeScript interfaces
│       └── routes/                # Route definitions
└── docker-compose.yml
```
