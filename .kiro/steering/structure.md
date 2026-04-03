# Project Structure

The repo is split into two independent apps, each with their own `package.json` and `.env`.

```
/
├── backend/                  # Express API server
│   ├── config/
│   │   └── passport.js       # Passport local strategy config
│   ├── middleware/
│   │   ├── isAuthenticated.js  # JWT verification middleware
│   │   └── admin.js            # Admin role guard
│   ├── models/               # Mongoose schemas
│   │   ├── User.js           # driver/rider, isApproved, isAdmin flags
│   │   ├── Ride.js           # ride listings
│   │   ├── Booking.js        # ride bookings
│   │   └── Otp.js            # OTP records for email verification
│   ├── routes/               # Express route handlers
│   │   ├── auth.js           # /api/auth/*
│   │   ├── ride.js           # /api/rides/*
│   │   ├── booking.js        # /api/bookings/*
│   │   ├── admin.js          # /api/admin/*
│   │   └── otp.js            # OTP endpoints
│   └── server.js             # App entry point, DB connection, Socket.io setup
│
└── carpool-app/              # React frontend
    └── src/
        ├── pages/            # One file per route/screen
        │   ├── Home.jsx
        │   ├── Login.jsx / Signup.jsx
        │   ├── DriverDashboard.jsx / RiderDashboard.jsx
        │   ├── CreateRide.jsx / AvailableRides.jsx / SearchRide.jsx
        │   ├── RideStatus.jsx / DriverRideConfirmed.jsx
        │   └── AdminDashboard.jsx
        ├── components/       # Shared/reusable UI components
        │   ├── Header.jsx
        │   ├── RideCard.jsx
        │   ├── FilterBox.jsx
        │   ├── MapPicker.jsx
        │   └── AdminRoute.jsx
        ├── config.js         # Axios instance with JWT interceptor
        └── App.js            # Router, ProtectedRoute, AdminRoute wrappers
```

## Conventions

- **API prefix**: All backend routes are under `/api/*`
- **Auth**: Protected routes use the `isAuthenticated` middleware; admin routes additionally use `admin` middleware
- **Frontend auth**: JWT stored in `localStorage` under key `token`; user object stored under key `user`. Use the axios instance from `src/config.js` for authenticated requests — it auto-attaches the token
- **Role routing**: Frontend routes are split by role (`/driver/*`, `/rider/*`). `ProtectedRoute` checks for a token; `AdminRoute` checks `user.isAdmin`
- **Models**: Always use `{ timestamps: true }` on Mongoose schemas
- **Socket.io**: The `io` instance is attached to the Express app via `app.set("io", io)` and accessed in routes via `req.app.get("io")`
- **Pages vs Components**: Full-screen views go in `pages/`, reusable UI pieces go in `components/`
