# Tech Stack

## Backend (`/backend`)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose
- **Auth**: JWT (`jsonwebtoken`) + Passport.js (local strategy) + bcrypt for password hashing
- **Email**: Brevo (`@getbrevo/brevo`) for OTP emails
- **Real-time**: Socket.io
- **Other**: `express-rate-limit`, `cors`, `dotenv`, `express-session`

## Frontend (`/carpool-app`)

- **Framework**: React 19 (Create React App)
- **Routing**: React Router DOM v7
- **HTTP**: Axios (with a pre-configured instance in `src/config.js` that auto-attaches JWT)
- **Maps**: Leaflet + React Leaflet

## Environment Variables

Backend (`.env`):
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default 5000)

Frontend (`.env`):
- `REACT_APP_API_URL` - Backend base URL

## Common Commands

### Backend
```bash
# Development (with auto-reload)
cd backend && npm run dev

# Production
cd backend && npm start
```

### Frontend
```bash
# Development server
cd carpool-app && npm start

# Production build
cd carpool-app && npm run build

# Run tests
cd carpool-app && npm test -- --watchAll=false
```
