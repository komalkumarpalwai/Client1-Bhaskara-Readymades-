import React from 'react';
import { useParams } from 'react-router-dom';

const AdminCustomerDetailsPage = () => {
  const { customerId } = useParams();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Customer Details Page</h1>
      {customerId && <p className="text-sm text-gray-500 mt-1">Customer ID: {customerId}</p>}
    </div>
  );
};

export default AdminCustomerDetailsPage;
