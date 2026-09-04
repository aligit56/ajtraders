import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await api.get('/orders/me');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-darkBlue dark:text-cyan" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-lightBlue dark:text-aqua border-l-4 border-darkBlue dark:border-cyan pl-3">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-lightTextSecondary dark:text-darkTextSecondary">You have no past orders.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-6 flex flex-col md:flex-row justify-between md:items-center">
              <div>
                <p className="text-sm text-lightTextSecondary dark:text-darkTextSecondary">Order #{order.id}</p>
                <p className="font-bold text-lg mt-1">Rs {order.total_price}</p>
                <p className="text-sm mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' :
                  order.status === 'Confirmed' ? 'bg-blue-500/20 text-blue-500' :
                  order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-lightTextSecondary dark:text-darkTextSecondary'
                }`}>
                  {order.status}
                </span>
                {/* Note: We aren't doing reorder functionality fully in MVP to save time, just displaying history */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
