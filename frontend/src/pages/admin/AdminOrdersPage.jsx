import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import AdminPagination from '../../components/admin/AdminPagination.jsx';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // View Order Modal State
  const [viewOrder, setViewOrder] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/orders');
        setOrders(res.data?.orders || res.orders || []);
      } catch (err) {
        setError(err.message || 'Failed to load orders from Salesforce.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleOpenView = async (orderId) => {
    setViewLoading(true);
    setViewOrder(null);
    try {
      const res = await api.get(`/admin/orders/${orderId}`);
      setViewOrder(res.data?.order || res.order || null);
    } catch (err) {
      alert('Failed to load order details from Salesforce: ' + err.message);
    } finally {
      setViewLoading(false);
    }
  };

  // Compute paginated items
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = orders.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-black pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide">Orders Management</h1>
          <p className="text-xs text-gray-600">Salesforce Order records</p>
        </div>
        <div className="text-xs font-mono border border-black px-3 py-1">
          {loading ? 'LOADING...' : `TOTAL: ${orders.length} ORDERS`}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-black text-white text-xs font-mono">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs font-mono uppercase tracking-widest text-gray-500">
          Fetching Orders from Salesforce...
        </div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center text-xs font-mono uppercase tracking-widest text-gray-500 border border-black p-8">
          No orders found in Salesforce Org.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-black overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black text-white font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Order Number</th>
                  <th className="py-2.5 px-3">Customer / Account</th>
                  <th className="py-2.5 px-3">Order Date</th>
                  <th className="py-2.5 px-3">Total Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-mono font-bold text-gray-600">{o.id}</td>
                    <td className="py-3 px-3 font-bold">{o.customer}</td>
                    <td className="py-3 px-3 text-gray-500 whitespace-nowrap">{o.date}</td>
                    <td className="py-3 px-3 font-bold">{o.amount}</td>
                    <td className="py-3 px-3 font-mono font-bold">{o.status}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleOpenView(o.sfId || o.id)}
                        className="border border-black px-2.5 py-1 text-[11px] font-mono uppercase hover:bg-black hover:text-white transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <AdminPagination
            currentPage={currentPage}
            totalItems={orders.length}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}

      {/* VIEW ORDER MODAL (ALL FIELDS & LINE ITEMS) */}
      {(viewOrder || viewLoading) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-3xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-black pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Salesforce Order Record</span>
                <h2 className="text-xl font-bold uppercase">{viewOrder?.id || 'Loading Order Details...'}</h2>
              </div>
              <button
                onClick={() => setViewOrder(null)}
                className="border border-black px-2 py-1 text-xs font-mono font-bold hover:bg-black hover:text-white"
              >
                ✕ CLOSE
              </button>
            </div>

            {viewLoading ? (
              <div className="py-8 text-center text-xs font-mono uppercase">Retrieving Order & OrderItems from Salesforce...</div>
            ) : viewOrder ? (
              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-4 border border-black p-4 bg-gray-50">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Salesforce Order ID</span>
                    <span className="font-bold text-sm text-black">{viewOrder.sfId || viewOrder.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Customer / Account Name</span>
                    <span className="font-bold text-sm text-black">{viewOrder.customer}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Customer Phone</span>
                    <span className="font-bold">{viewOrder.phone || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Order Status</span>
                    <span className="font-bold">{viewOrder.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Total Amount</span>
                    <span className="font-bold text-sm text-black">{viewOrder.totalAmount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Order Type</span>
                    <span className="font-bold">{viewOrder.type || 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Effective Date</span>
                    <span>{viewOrder.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Salesforce Created Date</span>
                    <span className="text-gray-700">{viewOrder.createdDate}</span>
                  </div>
                </div>

                {/* ORDER LINE ITEMS (CHILD OBJECT) */}
                <div className="border border-black p-4 space-y-2">
                  <div className="flex justify-between items-center border-b border-black pb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide">Order Line Items (OrderItem Child Object)</span>
                    <span className="text-[10px] text-gray-500">{viewOrder.items?.length || 0} Line Items</span>
                  </div>

                  {!viewOrder.items || viewOrder.items.length === 0 ? (
                    <div className="py-4 text-center text-gray-500 uppercase text-[11px]">
                      No individual OrderItems associated with this Order.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs border border-black mt-2">
                      <thead className="bg-black text-white font-mono uppercase text-[10px]">
                        <tr>
                          <th className="p-2">Line Item ID</th>
                          <th className="p-2">Product Name</th>
                          <th className="p-2">Product Code</th>
                          <th className="p-2">Qty</th>
                          <th className="p-2">Unit Price</th>
                          <th className="p-2 text-right">Total Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {viewOrder.items.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="p-2 font-mono text-gray-600">{item.id}</td>
                            <td className="p-2 font-bold">{item.productName}</td>
                            <td className="p-2 font-mono">{item.productCode}</td>
                            <td className="p-2 font-mono font-bold">{item.quantity}</td>
                            <td className="p-2 font-mono">{item.unitPrice}</td>
                            <td className="p-2 font-mono font-bold text-right">{item.totalPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {viewOrder.description && (
                  <div className="border border-black p-4">
                    <span className="text-gray-500 block text-[10px] uppercase mb-1">Order Notes / Description</span>
                    <p className="text-gray-800 whitespace-pre-wrap">{viewOrder.description}</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
