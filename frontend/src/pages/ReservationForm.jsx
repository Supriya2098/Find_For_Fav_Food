import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { formatINR } from '../utils/format';

export default function ReservationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [partySize, setPartySize] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/restaurants/${id}`).then(setRestaurant).catch(console.error);
  }, [id]);

  const deposit = Math.max(200, partySize * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const reservation = await api.post('/reservations', {
        restaurantId: id,
        date,
        time,
        partySize: Number(partySize),
        specialRequests: specialRequests || undefined,
      });
      navigate(`/reservations/${reservation.id}/checkout`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="max-w-lg mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Link to={`/restaurants/${id}`} className="text-brand-600 text-sm hover:underline">
        &larr; Back to {restaurant?.name || 'Restaurant'}
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-8">Reserve a Table</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 p-6 space-y-5">
        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={minDate}
            required
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Party Size</label>
          <select
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Special Requests (optional)</label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows={3}
            placeholder="Allergies, seating preferences, celebrations..."
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="bg-brand-50 rounded-lg p-4">
          <p className="text-sm text-brand-800">
            A deposit of <strong>{formatINR(deposit)}</strong> is required to confirm your reservation.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50 font-medium"
        >
          {loading ? 'Creating reservation...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  );
}
