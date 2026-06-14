import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { formatINR } from '../utils/format';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [method, setMethod] = useState('demo');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/reservations/${id}`),
      api.get('/payments/config'),
    ])
      .then(([res, config]) => {
        setReservation(res);
        setPaymentConfig(config);
        if (config.razorpay.enabled) setMethod('razorpay');
        else if (config.stripe.enabled) setMethod('stripe');
        else setMethod('demo');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleRazorpayPayment = (orderData) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: '4F — Find For Favorite Food',
        description: `Deposit for ${reservation.restaurant.name}`,
        image: reservation.restaurant.logoUrl || '/images/logos/paradise.svg',
        handler: resolve,
        modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    };
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
  });

  const handlePay = async () => {
    setPaying(true);
    setError('');
    try {
      const result = await api.post(`/reservations/${id}/checkout`, { provider: method });

      if (result.provider === 'demo') {
        await api.post(`/reservations/${id}/confirm-payment`, {
          paymentId: `demo_${Date.now()}`,
          provider: 'demo',
        });
        navigate(`/reservations/${id}/confirmation`);
        return;
      }

      if (result.provider === 'stripe' && result.url) {
        window.location.href = result.url;
        return;
      }

      if (result.provider === 'razorpay') {
        const response = await handleRazorpayPayment(result);
        await api.post(`/reservations/${id}/confirm-payment`, {
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          provider: 'razorpay',
        });
        navigate(`/reservations/${id}/confirmation`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
      </div>
    );
  }

  if (!reservation) {
    return <p className="text-center py-20 text-stone-500">Reservation not found.</p>;
  }

  if (reservation.paymentStatus === 'PAID') {
    navigate(`/reservations/${id}/confirmation`, { replace: true });
    return null;
  }

  const methods = [
    paymentConfig?.razorpay?.enabled && { id: 'razorpay', label: 'Razorpay (UPI / Card)', icon: '💳' },
    paymentConfig?.stripe?.enabled && { id: 'stripe', label: 'Stripe (Card)', icon: '🌐' },
    { id: 'demo', label: 'Demo Payment (Testing)', icon: '🧪' },
  ].filter(Boolean);

  return (
    <div className="max-w-lg mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-2">Payment</h1>
      <p className="text-stone-500 mb-8">Secure your table with a deposit</p>

      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
          {reservation.restaurant.logoUrl && (
            <img
              src={reservation.restaurant.logoUrl}
              alt={reservation.restaurant.name}
              className="w-14 h-14 rounded-full border border-stone-200 object-cover bg-white"
            />
          )}
          <div>
            <h2 className="font-semibold">{reservation.restaurant.name}</h2>
            <p className="text-sm text-stone-500">{reservation.restaurant.city}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500">Date</span>
            <span>{new Date(reservation.date).toLocaleDateString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Time</span>
            <span>{reservation.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Party Size</span>
            <span>{reservation.partySize} guests</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-semibold text-lg">
            <span>Deposit</span>
            <span className="text-brand-600">{formatINR(reservation.depositAmount)}</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-3">Payment Method</p>
          <div className="space-y-2">
            {methods.map((m) => (
              <label
                key={m.id}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                  method === m.id ? 'border-brand-600 bg-brand-50' : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={m.id}
                  checked={method === m.id}
                  onChange={() => setMethod(m.id)}
                  className="accent-brand-600"
                />
                <span>{m.icon}</span>
                <span className="text-sm">{m.label}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        <button
          onClick={handlePay}
          disabled={paying}
          className="w-full py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50 font-medium"
        >
          {paying ? 'Processing...' : `Pay ${formatINR(reservation.depositAmount)}`}
        </button>

        <p className="text-xs text-stone-400 text-center">
          Payments processed in INR. Confirmation email sent after successful payment.
        </p>
      </div>
    </div>
  );
}
