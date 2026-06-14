import crypto from 'crypto';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export function getDepositAmount(partySize) {
  return Math.max(200, partySize * 100);
}

export function getPaymentConfig() {
  return {
    provider: process.env.PAYMENT_PROVIDER || 'razorpay',
    razorpayEnabled: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    stripeEnabled: Boolean(process.env.STRIPE_SECRET_KEY),
  };
}

export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  if (!process.env.RAZORPAY_KEY_SECRET) return false;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
}

export async function createStripeCheckoutSession({ reservation, restaurant, userEmail, successUrl, cancelUrl }) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Add STRIPE_SECRET_KEY to .env');
  }

  const amount = Math.round(reservation.depositAmount * 100);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Table Reservation - ${restaurant.name}`,
            description: `${reservation.partySize} guests on ${new Date(reservation.date).toLocaleDateString()} at ${reservation.time}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      reservationId: reservation.id,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}

export async function createRazorpayOrder({ reservation, restaurant }) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env');
  }

  const amount = Math.round(reservation.depositAmount * 100);

  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString('base64');

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency: 'INR',
      receipt: `res_${reservation.id.slice(0, 8)}`,
      notes: {
        reservationId: reservation.id,
        restaurant: restaurant.name,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.description || 'Failed to create Razorpay order');
  }

  return response.json();
}
