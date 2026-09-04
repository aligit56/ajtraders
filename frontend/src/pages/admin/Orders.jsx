import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="flex justify-center"><Loader2 className="animate-spin text-darkBlue dark:text-cyan" size={40} /></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-lightText dark:text-darkText mb-6">Order Management</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-lightBg dark:bg-darkBg border-b border-lightBorder dark:border-darkBorder">
              <th className="p-4 text-darkBlue dark:text-cyan">Order ID</th>
              <th className="p-4 text-darkBlue dark:text-cyan">Customer</th>
              <th className="p-4 text-darkBlue dark:text-cyan">Total (Rs)</th>
              <th className="p-4 text-darkBlue dark:text-cyan">Status</th>
              <th className="p-4 text-darkBlue dark:text-cyan">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-lightBorder dark:border-darkBorder hover:bg-lightBg dark:bg-darkBg transition-colors">
                <td className="p-4">#{o.id}</td>
                <td className="p-4">
                  <div className="font-semibold">{o.user_name}</div>
                  <div className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">{o.phone}</div>
                </td>
                <td className="p-4 font-bold">Rs {o.total_price}</td>
                <td className="p-4">
                  <select 
                    value={o.status} 
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="bg-lightBg dark:bg-darkBg border border-lightBorder dark:border-darkBorder rounded px-2 py-1 text-sm outline-none focus:border-darkBlue dark:border-cyan"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="p-4">
                   <button onClick={() => alert(`Address: ${o.delivery_address}\nNotes: ${o.notes || 'N/A'}`)} className="text-darkBlue dark:text-cyan text-sm hover:underline">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
