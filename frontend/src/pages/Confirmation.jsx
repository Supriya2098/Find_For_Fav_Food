import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function Confirmation() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    async function load() {
      try {
        if (sessionId) {
          await api.post(`/reservations/${id}/confirm-payment`, {
            paymentId: sessionId,
            provider: 'stripe',
          });
        }
        const data = await api.get(`/reservations/${id}`);
        setReservation(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
      </div>
    );
  }

  if (!reservation) {
    return <p className="text-center py-20 text-stone-500">Reservation not found.</p>;
  }

  const isConfirmed = reservation.status === 'CONFIRMED' && reservation.paymentStatus === 'PAID';

  return (
    <div className="max-w-lg mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
        isConfirmed ? 'bg-green-100' : 'bg-yellow-100'
      }`}>
        <span className="text-4xl">{isConfirmed ? '✅' : '⏳'}</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">
        {isConfirmed ? 'Reservation Confirmed!' : 'Reservation Pending'}
      </h1>
      <p className="text-stone-600 mb-8">
        {isConfirmed
          ? 'A confirmation email has been sent to your inbox.'
          : 'Complete payment to confirm your reservation.'}
      </p>

      <div className="bg-white rounded-xl border border-stone-200 p-6 text-left space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">{reservation.restaurant.name}</h2>
          <div className="flex gap-2">
            <StatusBadge status={reservation.status} />
            <StatusBadge status={reservation.paymentStatus} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-stone-500">Date</p>
            <p className="font-medium">{new Date(reservation.date).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}</p>
          </div>
          <div>
            <p className="text-stone-500">Time</p>
            <p className="font-medium">{reservation.time}</p>
          </div>
          <div>
            <p className="text-stone-500">Party Size</p>
            <p className="font-medium">{reservation.partySize} guests</p>
          </div>
          <div>
            <p className="text-stone-500">Reservation ID</p>
            <p className="font-medium text-xs">{reservation.id}</p>
          </div>
        </div>
        <div>
          <p className="text-stone-500 text-sm">Address</p>
          <p className="font-medium">{reservation.restaurant.address}, {reservation.restaurant.city}</p>
        </div>
        {reservation.specialRequests && (
          <div>
            <p className="text-stone-500 text-sm">Special Requests</p>
            <p className="font-medium">{reservation.specialRequests}</p>
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-center">
        <Link
          to="/dashboard"
          className="px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
        >
          View My Reservations
        </Link>
        <Link
          to="/restaurants"
          className="px-6 py-2.5 border border-stone-300 rounded-lg hover:bg-stone-50 transition"
        >
          Browse More
        </Link>
      </div>
    </div>
  );
}
