import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {showBack && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-brand-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            <Link to="/" className="flex items-center gap-3 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border border-stone-200 bg-[#f5f0e6] shadow-sm">
                <div className="w-full h-full scale-[2.85] origin-[50%_32%]">
                  <img
                    src="/logo-4f.png"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="leading-tight min-w-0">
                <span className="text-xl font-bold text-brand-700 block">4F</span>
                <span className="text-[10px] text-stone-500 uppercase tracking-wide">Find For Favorite Food</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            <Link to="/restaurants" className="text-stone-600 hover:text-brand-600 transition text-sm sm:text-base">
              Restaurants
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-stone-600 hover:text-brand-600 transition text-sm sm:text-base hidden sm:inline">
                  My Reservations
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-stone-600 hover:text-brand-600 transition text-sm sm:text-base hidden sm:inline">
                    Admin
                  </Link>
                )}
                <span className="text-stone-500 text-sm hidden md:inline">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 sm:px-4 py-2 text-sm bg-stone-100 hover:bg-stone-200 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-stone-600 hover:text-brand-600 transition text-sm sm:text-base">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 sm:px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
