import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { formatINR } from '../utils/format';

export default function Dashboard() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reservations/my')
      .then(setReservations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this reservation?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'CANCELLED' } : r))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Reservations</h1>
          <p className="text-stone-600 mt-1">Welcome back, {user?.name}</p>
        </div>
        <Link
          to="/restaurants"
          className="px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition text-center"
        >
          Book New Table
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-stone-200">
          <p className="text-stone-500 mb-4">You don't have any reservations yet.</p>
          <Link to="/restaurants" className="text-brand-600 hover:underline">
            Browse restaurants to get started
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => (
            <div key={res.id} className="bg-white rounded-xl border border-stone-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{res.restaurant.name}</h3>
                  <p className="text-stone-500 text-sm">{res.restaurant.address}, {res.restaurant.city}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <span>📅 {new Date(res.date).toLocaleDateString()}</span>
                    <span>🕐 {res.time}</span>
                    <span>👥 {res.partySize} guests</span>
                    <span>💰 Deposit: {formatINR(res.depositAmount)}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <StatusBadge status={res.status} />
                    <StatusBadge status={res.paymentStatus} />
                  </div>
                </div>
                <div className="flex gap-2">
                  {res.paymentStatus === 'UNPAID' && res.status !== 'CANCELLED' && (
                    <Link
                      to={`/reservations/${res.id}/checkout`}
                      className="px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition"
                    >
                      Pay Deposit
                    </Link>
                  )}
                  {res.status === 'CONFIRMED' && (
                    <Link
                      to={`/reservations/${res.id}/confirmation`}
                      className="px-4 py-2 border border-stone-300 text-sm rounded-lg hover:bg-stone-50 transition"
                    >
                      View Details
                    </Link>
                  )}
                  {res.status !== 'CANCELLED' && res.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleCancel(res.id)}
                      className="px-4 py-2 text-red-600 text-sm border border-red-200 rounded-lg hover:bg-red-50 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
