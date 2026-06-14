import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';

export default function RestaurantCard({ restaurant }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition group">
      <div className="aspect-[16/10] overflow-hidden bg-stone-200 relative">
        <SafeImage
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          fallback="🍽️"
        />
        {restaurant.logoUrl && (
          <SafeImage
            src={restaurant.logoUrl}
            alt={`${restaurant.name} logo`}
            className="absolute bottom-3 left-3 w-12 h-12 rounded-full border-2 border-white shadow-md bg-white object-contain p-1"
            fallback="🍴"
          />
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-stone-900">{restaurant.name}</h3>
          <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full whitespace-nowrap">
            {restaurant.cuisine}
          </span>
        </div>
        <p className="text-stone-500 text-sm mt-1">{restaurant.city}</p>
        <p className="text-stone-600 text-sm mt-2 line-clamp-2">{restaurant.description}</p>
        <div className="flex gap-3 mt-4">
          <Link
            to={`/restaurants/${restaurant.id}/menu`}
            className="flex-1 text-center py-2 text-sm border border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 transition"
          >
            View Menu
          </Link>
          <Link
            to={`/restaurants/${restaurant.id}`}
            className="flex-1 text-center py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
          >
            Book Table
          </Link>
        </div>
      </div>
    </div>
  );
}
