import { useState, useEffect } from 'react';
import { api } from '../api/client';
import RestaurantCard from '../components/RestaurantCard';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (cuisine) params.set('cuisine', cuisine);

    setLoading(true);
    api.get(`/restaurants?${params}`)
      .then(setRestaurants)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, cuisine]);

  const cuisines = [...new Set(restaurants.map((r) => r.cuisine))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-2">Restaurants</h1>
      <p className="text-stone-600 mb-8">Find your next dining experience</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Cuisines</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
        </div>
      ) : restaurants.length === 0 ? (
        <p className="text-center text-stone-500 py-20">No restaurants found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}
