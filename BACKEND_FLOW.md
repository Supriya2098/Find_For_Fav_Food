# Backend Flow — Restaurant Reservation System

## Architecture Overview

```
Frontend (React)  →  Express API  →  Prisma ORM  →  SQLite Database
                         ↓
              Services: Payment, Email
                         ↓
              External: Razorpay / Stripe / SMTP
```

## Database Relationships

```
User (1) ──────< Reservation >────── (1) Restaurant
                                              │
                                              └──< MenuItem (many)
```

| Model | Key Fields |
|-------|-----------|
| **User** | email, password (hashed), name, role (USER/ADMIN) |
| **Restaurant** | name, address, city, cuisine, imageUrl, logoUrl |
| **MenuItem** | name, price (INR), category, imageUrl, restaurantId |
| **Reservation** | date, time, partySize, status, depositAmount, paymentStatus |

## API Flow — Complete Reservation Journey

### 1. Authentication
```
POST /api/auth/register  →  Create user, return JWT
POST /api/auth/login     →  Verify password, return JWT
GET  /api/auth/me        →  Get logged-in user (requires token)
```

### 2. Browse Restaurants & Menus
```
GET /api/restaurants              →  List all Hyderabad restaurants
GET /api/restaurants/:id          →  Restaurant details + menu
GET /api/menus/restaurant/:id     →  Menu items grouped by category
```

### 3. Create Reservation
```
POST /api/reservations
  Body: { restaurantId, date, time, partySize, specialRequests }
  →  Calculates deposit (₹200 min, ₹100 per guest)
  →  Status: PENDING, Payment: UNPAID
```

### 4. Payment Flow
```
GET  /api/payments/config         →  Returns available payment providers

POST /api/reservations/:id/checkout
  Body: { provider: "razorpay" | "stripe" | "demo" }
  →  razorpay: Creates Razorpay order, returns orderId + keyId
  →  stripe:   Creates Stripe checkout session, returns redirect URL
  →  demo:     Returns amount for testing without real payment

POST /api/reservations/:id/confirm-payment
  Body: { paymentId, provider, orderId?, signature? }
  →  Verifies Razorpay signature (if applicable)
  →  Updates: paymentStatus=PAID, status=CONFIRMED
  →  Sends confirmation email via Nodemailer
```

### 5. User Dashboard
```
GET /api/reservations/my    →  User's reservations with restaurant info
DELETE /api/reservations/:id  →  Cancel reservation
```

### 6. Admin Dashboard
```
GET   /api/reservations           →  All reservations (admin only)
PATCH /api/reservations/:id/status →  Update status (CONFIRMED/COMPLETED/CANCELLED)
POST  /api/restaurants            →  Add restaurant
POST  /api/menus                  →  Add menu item
```

## Payment Integration Details

### Razorpay (Primary — India)
1. Backend creates order via Razorpay API
2. Frontend opens Razorpay checkout modal
3. User pays via UPI/Card/Netbanking
4. Razorpay returns payment_id + signature
5. Backend verifies HMAC signature before confirming

**Env vars:** `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

### Stripe (Alternative)
1. Backend creates Checkout Session (INR currency)
2. User redirected to Stripe hosted page
3. On success, redirected to confirmation page
4. Frontend calls confirm-payment with session_id

**Env vars:** `STRIPE_SECRET_KEY`

### Demo Mode (Local Testing)
- No API keys needed
- Simulates payment instantly
- Full flow works: reservation → pay → email → confirmation

## Email Notifications

Triggered on `confirm-payment`:
- SMTP via Nodemailer (Gmail App Password)
- If SMTP not configured, logs email to console
- Contains: restaurant, date, time, party size, address

**Env vars:** `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`

## Security

- JWT authentication on protected routes
- bcrypt password hashing
- Role-based access (USER vs ADMIN)
- Razorpay payment signature verification
- CORS restricted to frontend URL

## Running the Backend

```bash
cd backend
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev    # http://localhost:5000
```
