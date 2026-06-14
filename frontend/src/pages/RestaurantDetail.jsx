import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import SafeImage from '../components/SafeImage';

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/restaurants/${id}`)
      .then(setRestaurant)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
      </div>
    );
  }

  if (!restaurant) {
    return <p className="text-center py-20 text-stone-500">Restaurant not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="aspect-[21/9] rounded-xl overflow-hidden bg-stone-200 mb-8">
        <SafeImage
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          fallback="🍽️"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          {restaurant.logoUrl && (
            <SafeImage
              src={restaurant.logoUrl}
              alt={`${restaurant.name} logo`}
              className="w-16 h-16 rounded-full border-2 border-stone-200 shadow-sm bg-white object-contain p-1 flex-shrink-0"
              fallback="🍴"
            />
          )}
          <div>
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-stone-500 mt-1">{restaurant.address}, {restaurant.city}</p>
          <span className="inline-block mt-2 bg-brand-100 text-brand-700 text-sm px-3 py-1 rounded-full">
            {restaurant.cuisine}
          </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/restaurants/${id}/menu`}
            className="px-6 py-2.5 border border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 transition"
          >
            View Menu
          </Link>
          <Link
            to={`/restaurants/${id}/reserve`}
            className="px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
          >
            Reserve Table
          </Link>
        </div>
      </div>

      <p className="text-stone-600 text-lg mb-8">{restaurant.description}</p>

      <div className="grid sm:grid-cols-3 gap-4 bg-white rounded-xl border border-stone-200 p-6">
        <div>
          <p className="text-sm text-stone-500">Hours</p>
          <p className="font-medium">{restaurant.openingTime} - {restaurant.closingTime}</p>
        </div>
        <div>
          <p className="text-sm text-stone-500">Capacity</p>
          <p className="font-medium">{restaurant.capacity} seats</p>
        </div>
        <div>
          <p className="text-sm text-stone-500">Menu Items</p>
          <p className="font-medium">{restaurant.menuItems?.length || 0} dishes</p>
        </div>
      </div>
    </div>
  );
}
