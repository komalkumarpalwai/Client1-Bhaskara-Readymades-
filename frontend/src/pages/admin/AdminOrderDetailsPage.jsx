import React from 'react';
import { useParams } from 'react-router-dom';

const AdminOrderDetailsPage = () => {
  const { orderId } = useParams();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Order Details Page</h1>
      {orderId && <p className="text-sm text-gray-500 mt-1">Order ID: {orderId}</p>}
    </div>
  );
};

export default AdminOrderDetailsPage;
