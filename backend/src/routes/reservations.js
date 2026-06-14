import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { sendReservationConfirmation } from '../services/email.js';
import {
  createStripeCheckoutSession,
  createRazorpayOrder,
  getDepositAmount,
  verifyRazorpaySignature,
} from '../services/payment.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/my', authenticate, async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: req.user.id },
      include: {
        restaurant: { select: { id: true, name: true, address: true, city: true, imageUrl: true } },
      },
      orderBy: { date: 'desc' },
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { restaurantId, status } = req.query;
    const where = {};
    if (restaurantId) where.restaurantId = restaurantId;
    if (status) where.status = status;

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        restaurant: { select: { id: true, name: true } },
      },
      orderBy: { date: 'desc' },
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        restaurant: true,
      },
    });

    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    if (req.user.role !== 'ADMIN' && reservation.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { restaurantId, date, time, partySize, specialRequests } = req.body;
    if (!restaurantId || !date || !time || !partySize) {
      return res.status(400).json({ error: 'restaurantId, date, time, and partySize are required' });
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    const depositAmount = getDepositAmount(Number(partySize));

    const reservation = await prisma.reservation.create({
      data: {
        restaurantId,
        userId: req.user.id,
        date: new Date(date),
        time,
        partySize: Number(partySize),
        specialRequests,
        depositAmount,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
      },
      include: { restaurant: true },
    });

    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/checkout', authenticate, async (req, res) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: req.params.id },
      include: { restaurant: true, user: true },
    });

    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    if (reservation.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });
    if (reservation.paymentStatus === 'PAID') {
      return res.status(400).json({ error: 'Reservation already paid' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const provider = req.body.provider || process.env.PAYMENT_PROVIDER || 'razorpay';

    if (provider === 'demo') {
      return res.json({
        provider: 'demo',
        amount: Math.round(reservation.depositAmount * 100),
        currency: 'INR',
        reservationId: reservation.id,
      });
    }

    if (provider === 'razorpay') {
      const order = await createRazorpayOrder({ reservation, restaurant: reservation.restaurant });
      await prisma.reservation.update({
        where: { id: reservation.id },
        data: { paymentId: order.id },
      });
      return res.json({
        provider: 'razorpay',
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        reservationId: reservation.id,
      });
    }

    const session = await createStripeCheckoutSession({
      reservation,
      restaurant: reservation.restaurant,
      userEmail: reservation.user.email,
      successUrl: `${frontendUrl}/reservations/${reservation.id}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${frontendUrl}/reservations/${reservation.id}/checkout?cancelled=true`,
    });

    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { paymentId: session.id },
    });

    res.json({ provider: 'stripe', sessionId: session.id, url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/confirm-payment', authenticate, async (req, res) => {
  try {
    const { paymentId, provider, orderId, signature } = req.body;
    const reservation = await prisma.reservation.findUnique({
      where: { id: req.params.id },
      include: { restaurant: true, user: true },
    });

    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    if (reservation.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });

    if (provider === 'razorpay' && orderId && paymentId && signature) {
      const valid = verifyRazorpaySignature({ orderId, paymentId, signature });
      if (!valid) {
        return res.status(400).json({ error: 'Invalid Razorpay payment signature' });
      }
    }

    const updated = await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        paymentId: paymentId || reservation.paymentId,
      },
      include: { restaurant: true, user: true },
    });

    await sendReservationConfirmation({
      to: updated.user.email,
      userName: updated.user.name,
      reservation: updated,
      restaurant: updated.restaurant,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await prisma.reservation.update({
      where: { id: req.params.id },
      data: { status },
      include: { restaurant: true, user: true },
    });
    res.json(reservation);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Reservation not found' });
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const reservation = await prisma.reservation.findUnique({ where: { id: req.params.id } });
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    if (req.user.role !== 'ADMIN' && reservation.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.reservation.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
