import React from 'react';
import { useParams } from 'react-router-dom';

const AdminEditProductPage = () => {
  const { productId } = useParams();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Edit Product Page</h1>
      {productId && <p className="text-sm text-gray-500 mt-1">Product ID: {productId}</p>}
    </div>
  );
};

export default AdminEditProductPage;
