import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            4F — Find For Favorite Food
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto mb-8">
            Discover Hyderabad's best restaurants. Browse menus from Paradise, Bawarchi, Pista House & more.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/restaurants"
              className="px-8 py-3 bg-white text-brand-700 font-semibold rounded-lg hover:bg-brand-50 transition"
            >
              Browse Restaurants
            </Link>
            {user ? (
              <Link
                to="/dashboard"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
              >
                My Reservations
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '🔍', title: 'Browse', desc: 'Explore restaurants and view their full menus online.' },
            { icon: '📅', title: 'Reserve', desc: 'Pick your date, time, and party size in seconds.' },
            { icon: '✅', title: 'Confirm', desc: 'Pay a small deposit and receive email confirmation.' },
          ].map((step) => (
            <div key={step.title} className="text-center p-6">
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-stone-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
