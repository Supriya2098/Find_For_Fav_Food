import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import restaurantRoutes from './routes/restaurants.js';
import menuRoutes from './routes/menus.js';
import reservationRoutes from './routes/reservations.js';
import paymentRoutes from './routes/payments.js';
import { validateEnv } from './lib/env.js';
import { prisma } from './lib/prisma.js';

validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: '4F Restaurant API is running',
    frontend: process.env.FRONTEND_URL || 'http://localhost:5173',
    health: '/api/health',
  });
});

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Database connected');
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
    console.error('Run: npm run db:push && npm run db:seed');
    process.exit(1);
  }
});
