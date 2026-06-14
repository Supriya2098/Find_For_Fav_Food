import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReservationForm from './pages/ReservationForm';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/restaurants/:id/menu" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/restaurants/:id/reserve" element={<ProtectedRoute><ReservationForm /></ProtectedRoute>} />
          <Route path="/reservations/:id/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/reservations/:id/confirmation" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      <footer className="bg-stone-900 text-stone-400 py-8 text-center text-sm">
        <p>&copy; 2026 4F — Find For Favorite Food. Hyderabad Restaurant Reservations.</p>
      </footer>
    </div>
  );
}
