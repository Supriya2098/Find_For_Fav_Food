import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendReservationConfirmation({ to, userName, reservation, restaurant }) {
  const transport = getTransporter();
  const dateStr = new Date(reservation.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #c2410c;">Reservation Confirmed!</h2>
      <p>Hi ${userName},</p>
      <p>Your table reservation has been confirmed. Here are the details:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Restaurant</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${restaurant.name}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${dateStr}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Time</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.time}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Party Size</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.partySize} guests</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Address</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${restaurant.address}, ${restaurant.city}</td></tr>
        <tr><td style="padding: 8px;"><strong>Reservation ID</strong></td><td style="padding: 8px;">${reservation.id}</td></tr>
      </table>
      <p>We look forward to seeing you!</p>
    </div>
  `;

  if (!transport) {
    console.log('[Email] SMTP not configured. Would send confirmation to:', to);
    console.log('[Email] Subject: Reservation Confirmed at', restaurant.name);
    return { sent: false, preview: true };
  }

  await transport.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject: `Reservation Confirmed at ${restaurant.name}`,
    html,
  });

  return { sent: true };
}
