import { Router } from 'express';

const router = Router();

router.get('/config', (_req, res) => {
  const provider = process.env.PAYMENT_PROVIDER || 'razorpay';
  res.json({
    provider,
    currency: 'INR',
    razorpay: {
      enabled: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      keyId: process.env.RAZORPAY_KEY_ID || null,
    },
    stripe: {
      enabled: Boolean(process.env.STRIPE_SECRET_KEY),
    },
    demo: {
      enabled: true,
      note: 'Use demo mode for local testing without payment keys',
    },
  });
});

export default router;
