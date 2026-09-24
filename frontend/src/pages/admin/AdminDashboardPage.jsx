import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [leadsCount, setLeadsCount] = useState('...');
  const [productsCount, setProductsCount] = useState('...');
  const [ordersCount, setOrdersCount] = useState('...');
  const [recentLeads, setRecentLeads] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [leadsRes, productsRes, ordersRes] = await Promise.all([
          api.get('/admin/customers').catch(() => ({ customers: [] })),
          api.get('/admin/products').catch(() => ({ products: [] })),
          api.get('/admin/orders').catch(() => ({ orders: [] }))
        ]);

        const leads = leadsRes.data?.customers || leadsRes.customers || [];
        const products = productsRes.data?.products || productsRes.products || [];
        const orders = ordersRes.data?.orders || ordersRes.orders || [];

        setLeadsCount(leads.length.toString());
        setProductsCount(products.length.toString());
        setOrdersCount(orders.length.toString());

        setRecentLeads(leads.slice(0, 5));
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.warn('Dashboard fetch warning:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { label: "Contact Leads", value: leadsCount, link: "/admin/customers", desc: "Salesforce Lead records" },
    { label: "Custom Products", value: productsCount, link: "/admin/products", desc: "Product2 (Is_Custom_Product__c = true)" },
    { label: "Orders", value: ordersCount, link: "/admin/orders", desc: "Salesforce Order transactions" }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-black pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide">
            Dashboard
          </h1>
          <p className="text-xs text-gray-600 font-mono">
            Signed in as: {user?.email || 'admin@bhaskarareadymades.com'}
          </p>
        </div>
        <div className="text-xs font-mono border border-black px-3 py-1 self-start sm:self-auto">
          SALESFORCE: CONNECTED
        </div>
      </div>

      {/* 3 Main Summary Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Link
            key={i}
            to={stat.link}
            className="border border-black p-5 hover:bg-black hover:text-white transition-colors block group"
          >
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">
                {stat.label}
              </span>
              <span className="text-xs underline group-hover:text-white text-gray-600">
                View →
              </span>
            </div>
            <div className="text-3xl font-black mb-1">
              {loading ? '...' : stat.value}
            </div>
            <div className="text-xs text-gray-500 group-hover:text-gray-300">
              {stat.desc}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Leads Table */}
      <div className="border border-black p-5 space-y-3">
        <div className="flex justify-between items-center border-b border-black pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider">
            Recent Contact Leads (Salesforce)
          </h2>
          <Link to="/admin/customers" className="text-xs underline hover:font-bold">
            All Leads ({leadsCount}) →
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="py-6 text-center text-xs font-mono text-gray-500">
            {loading ? 'Fetching Leads...' : 'No leads currently in Salesforce.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-300 font-mono uppercase text-gray-600">
                  <th className="py-2">Name</th>
                  <th className="py-2">Phone</th>
                  <th className="py-2">Source / Category</th>
                  <th className="py-2">Date</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentLeads.map((lead, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-2.5 font-bold">{lead.name}</td>
                    <td className="py-2.5 font-mono">{lead.phone}</td>
                    <td className="py-2.5">{lead.category}</td>
                    <td className="py-2.5 text-gray-500">{lead.date}</td>
                    <td className="py-2.5 text-right font-mono font-bold">{lead.status || lead.sfStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Orders Table */}
      <div className="border border-black p-5 space-y-3">
        <div className="flex justify-between items-center border-b border-black pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider">
            Recent Orders (Salesforce)
          </h2>
          <Link to="/admin/orders" className="text-xs underline hover:font-bold">
            All Orders ({ordersCount}) →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-6 text-center text-xs font-mono text-gray-500">
            {loading ? 'Fetching Orders...' : 'No orders currently in Salesforce.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-300 font-mono uppercase text-gray-600">
                  <th className="py-2">Order ID</th>
                  <th className="py-2">Customer</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-2.5 font-mono font-bold">{order.id}</td>
                    <td className="py-2.5">{order.customer}</td>
                    <td className="py-2.5 font-bold">{order.amount}</td>
                    <td className="py-2.5 text-right font-mono font-bold">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
