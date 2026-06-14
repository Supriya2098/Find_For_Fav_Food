# 4F(FIND FOR FAVORITE FOOD) - Restaurant Reservation System

Full-stack restaurant booking and menu browsing application built for Week 5 & 6 coursework.

## Features

### Week 5
- Database schema with Users, Restaurants, MenuItems, and Reservations (Prisma ORM)
- REST API for restaurants and menus
- Menu browsing pages with category filters
- User dashboard with reservation management

### Week 6
- Reservation creation and management endpoints
- Stripe & Razorpay payment integration (with demo fallback)
- Email confirmation notifications (Nodemailer)
- Admin dashboard for restaurant and menu management
- Deployment-ready configuration

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | Node.js, Express, Prisma, SQLite    |
| Frontend | React, Vite, Tailwind CSS           |
| Auth     | JWT + bcrypt                        |
| Payments | Stripe / Razorpay                   |
| Email    | Nodemailer (SMTP)                   |

## Database Schema

```
User ──────< Reservation >────── Restaurant
                                      │
                                      └──< MenuItem
```

## Quick Start

### Prerequisites
- Node.js 18+

### Backend

```bash
cd backend
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Server runs at `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Demo Accounts

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@restaurant.com   | admin123  |
| User  | user@example.com       | user123   |

## API Endpoints

| Method | Endpoint                          | Auth  | Description              |
|--------|-----------------------------------|-------|--------------------------|
| POST   | /api/auth/register                | No    | Register user            |
| POST   | /api/auth/login                   | No    | Login                    |
| GET    | /api/auth/me                      | Yes   | Current user             |
| GET    | /api/restaurants                  | No    | List restaurants         |
| GET    | /api/restaurants/:id              | No    | Restaurant details       |
| POST   | /api/restaurants                  | Admin | Create restaurant        |
| GET    | /api/menus/restaurant/:id         | No    | Restaurant menu          |
| POST   | /api/menus                        | Admin | Create menu item         |
| GET    | /api/reservations/my              | Yes   | User's reservations      |
| POST   | /api/reservations                 | Yes   | Create reservation       |
| POST   | /api/reservations/:id/checkout    | Yes   | Start payment            |
| POST   | /api/reservations/:id/confirm-payment | Yes | Confirm payment       |
| GET    | /api/reservations                 | Admin | All reservations         |

## Configuration

Copy `backend/.env.example` to `backend/.env` and configure:

- **Stripe**: Get test keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
- **Razorpay**: Get keys from [Razorpay Dashboard](https://dashboard.razorpay.com) and set `PAYMENT_PROVIDER=razorpay`
- **Email**: Use Gmail App Password or any SMTP provider

Without payment keys configured, the app uses **demo payment mode** for testing.

## Deployment

### Backend (Render / Railway)
1. Set environment variables from `.env.example`
2. Change `DATABASE_URL` to PostgreSQL: `postgresql://...`
3. Update `prisma/schema.prisma` provider to `postgresql`
4. Run `npx prisma db push && node prisma/seed.js`
5. Start with `npm start`

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your deployed backend URL + `/api`
2. Build with `npm run build`
3. Deploy the `dist` folder

## Project Structure

```
restaurant-reservation-system/
├── backend/
│   ├── prisma/schema.prisma    # Database schema
│   ├── prisma/seed.js          # Sample data
│   └── src/
│       ├── routes/             # API routes
│       ├── services/           # Email & payment
│       └── middleware/         # Auth middleware
└── frontend/
    └── src/
        ├── pages/              # All page components
        ├── components/         # Reusable UI
        └── context/            # Auth state
```
