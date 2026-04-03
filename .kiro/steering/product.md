# UniLift - Product Overview

UniLift is a university-focused carpooling platform that connects student drivers and riders for shared commutes.

## Core Concepts

- **Roles**: Users register as either a `driver` or `rider`
- **Drivers**: Must be approved by an admin before posting rides. They create rides with origin, destination, date, seats, and price
- **Riders**: Browse and book available rides
- **Admin**: Manages driver approvals and platform oversight via a dedicated dashboard
- **Authentication**: Email/OTP verification on signup, JWT-based sessions

## Key Flows

1. User signs up → OTP email verification → role-based dashboard
2. Driver creates ride → riders search/book → driver confirms/rejects bookings
3. Admin approves drivers and monitors the platform

## Deployment

- Frontend: Vercel (`https://unilift-frontend.vercel.app`)
- Backend: Node.js server (port 5000 by default)
- Database: MongoDB Atlas (via `MONGO_URI` env var)
