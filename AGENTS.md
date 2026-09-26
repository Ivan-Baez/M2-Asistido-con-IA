puede# AGENTS.md - PM2-Ivan-Baez

## Project Structure

- **front/** - Frontend (Webpack, live-server, Axios)
- **back/** - Backend (Express 5, Mongoose, MongoDB, dotenv, cors, morgan)
- **chalannge-teasting/** - Test project (Jest)

## Commands

### Frontend
```bash
cd front
npm install
npm run build    # webpack --watch
npm start        # live-server
```

### Backend
```bash
cd back
npm install
npm start        # nodemon index.js (requires MongoDB running)
```

### Tests
```bash
cd chalannge-teasting
npm install
npm test         # jest
```

## Environment

Backend requires `.env` with MongoDB connection string (see `back/.env.example` if exists).

## Entry Points

- Frontend: `front/scripts/index.js` (webpack entry) → `front/public/bundle.js`
- Backend: `back/index.js` (Express + Mongoose)
- Frontend HTML: `front/index.html`, `front/newMovie.html`, `front/historiacine.html`, `front/sobreproyecto.html`

## Tech Stack

- **Frontend**: Vanilla JS, Webpack 5, Axios, live-server
- **Backend**: Express 5, Mongoose 8, MongoDB, dotenv, cors, morgan
- **Testing**: Jest