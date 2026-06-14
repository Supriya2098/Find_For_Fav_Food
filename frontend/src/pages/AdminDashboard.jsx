import { useState, useEffect } from 'react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboard() {
  const [tab, setTab] = useState('reservations');
  const [restaurants, setRestaurants] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newRestaurant, setNewRestaurant] = useState({
    name: '', description: '', address: '', city: '', cuisine: '',
  });
  const [newMenuItem, setNewMenuItem] = useState({
    name: '', description: '', price: '', category: '', restaurantId: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [rests, resvs] = await Promise.all([
        api.get('/restaurants'),
        api.get('/reservations'),
      ]);
      setRestaurants(rests);
      setReservations(resvs);
      if (rests.length && !newMenuItem.restaurantId) {
        setNewMenuItem((prev) => ({ ...prev, restaurantId: rests[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      await api.post('/restaurants', newRestaurant);
      setNewRestaurant({ name: '', description: '', address: '', city: '', cuisine: '' });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      await api.post('/menus', {
        ...newMenuItem,
        price: Number(newMenuItem.price),
      });
      setNewMenuItem({ name: '', description: '', price: '', category: '', restaurantId: newMenuItem.restaurantId });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const tabs = [
    { id: 'reservations', label: 'Reservations' },
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'menu', label: 'Add Menu Item' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="flex gap-2 mb-8 border-b border-stone-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition -mb-px ${
              tab === t.id
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
        </div>
      ) : (
        <>
          {tab === 'reservations' && (
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <p className="text-stone-500">No reservations yet.</p>
              ) : (
                reservations.map((res) => (
                  <div key={res.id} className="bg-white rounded-xl border border-stone-200 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="font-semibold">{res.restaurant.name}</p>
                        <p className="text-sm text-stone-500">
                          {res.user.name} ({res.user.email})
                        </p>
                        <p className="text-sm mt-1">
                          {new Date(res.date).toLocaleDateString()} at {res.time} &middot; {res.partySize} guests
                        </p>
                        <div className="flex gap-2 mt-2">
                          <StatusBadge status={res.status} />
                          <StatusBadge status={res.paymentStatus} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {res.status === 'CONFIRMED' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'COMPLETED')}
                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg"
                          >
                            Mark Completed
                          </button>
                        )}
                        {res.status !== 'CANCELLED' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'CANCELLED')}
                            className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'restaurants' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <form onSubmit={handleAddRestaurant} className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
                <h2 className="font-semibold text-lg">Add Restaurant</h2>
                {['name', 'description', 'address', 'city', 'cuisine'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                    <input
                      value={newRestaurant[field]}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, [field]: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                ))}
                <button type="submit" className="w-full py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
                  Add Restaurant
                </button>
              </form>

              <div className="space-y-3">
                <h2 className="font-semibold text-lg">Existing Restaurants ({restaurants.length})</h2>
                {restaurants.map((r) => (
                  <div key={r.id} className="bg-white rounded-lg border border-stone-200 p-4">
                    <p className="font-medium">{r.name}</p>
                    <p className="text-sm text-stone-500">{r.cuisine} &middot; {r.city}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'menu' && (
            <form onSubmit={handleAddMenuItem} className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 max-w-lg">
              <h2 className="font-semibold text-lg">Add Menu Item</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Restaurant</label>
                <select
                  value={newMenuItem.restaurantId}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, restaurantId: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                >
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              {['name', 'description', 'category'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                  <input
                    value={newMenuItem[field]}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, [field]: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
                Add Menu Item
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
