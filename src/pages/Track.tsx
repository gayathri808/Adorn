import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LoaderIcon, MapPin, Truck, CheckCircle } from 'lucide-react';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// These are the defined steps in order
const statusSteps = ['ordered', 'shipped', 'dispatched', 'out for delivery', 'delivered'];

const Track = () => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState('');

  const handleTrackOrder = async () => {
    setLoading(true);
    setError('');
    setOrderStatus(null);

    const { data, error } = await supabase
      .from('orders')
      .select('order_status')
      .eq('order_id', orderId)
      .single();

    setLoading(false);

    if (error || !data) {
      setError('Order not found. Please check your Order ID.');
    } else {
      setOrderStatus(data.order_status.toLowerCase());
    }
  };

  const getStepStyle = (step) => {
    const currentIndex = statusSteps.indexOf(orderStatus);
    const thisIndex = statusSteps.indexOf(step);
    if (thisIndex < currentIndex) return 'text-green-600';
    if (thisIndex === currentIndex) return 'text-blue-600';
    return 'text-gray-400';
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-6">Track Your Order</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <input
          type="text"
          placeholder="Enter your Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <button
          onClick={handleTrackOrder}
          disabled={loading || !orderId}
          className="w-full bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          {loading ? 'Tracking...' : 'Track Order'}
        </button>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>

      {orderStatus && (
        <div className="space-y-6 bg-gray-100 rounded-lg p-6">
          {statusSteps.map((step) => {
            const Icon =
              step === 'ordered'
                ? MapPin
                : step === 'shipped'
                ? Truck
                : step === 'dispatched'
                ? LoaderIcon
                : step === 'out for delivery'
                ? Truck
                : CheckCircle;

            return (
              <div key={step} className="flex items-center gap-4">
                <Icon className={`${getStepStyle(step)} w-6 h-6`} />
                <span className={`capitalize ${getStepStyle(step)} font-medium`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Track;
