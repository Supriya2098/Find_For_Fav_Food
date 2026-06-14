import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import MenuItemCard from '../components/MenuItemCard';

export default function Menu() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({ items: [], categories: [] });
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/restaurants/${id}`),
      api.get(`/menus/restaurant/${id}`),
    ])
      .then(([rest, menuData]) => {
        setRestaurant(rest);
        setMenu(menuData);
        if (menuData.categories.length) setActiveCategory(menuData.categories[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const filtered = activeCategory
    ? menu.items.filter((item) => item.category === activeCategory)
    : menu.items;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Link to={`/restaurants/${id}`} className="text-brand-600 text-sm hover:underline">
            &larr; Back to {restaurant?.name}
          </Link>
          <h1 className="text-3xl font-bold mt-2">Menu</h1>
        </div>
        <Link
          to={`/restaurants/${id}/reserve`}
          className="px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition text-center"
        >
          Reserve a Table
        </Link>
      </div>

      {menu.categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setActiveCategory('')}
            className={`px-4 py-2 rounded-full text-sm transition ${
              !activeCategory ? 'bg-brand-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All
          </button>
          {menu.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                activeCategory === cat ? 'bg-brand-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-center text-stone-500 py-12">No menu items available.</p>
        ) : (
          filtered.map((item) => <MenuItemCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
