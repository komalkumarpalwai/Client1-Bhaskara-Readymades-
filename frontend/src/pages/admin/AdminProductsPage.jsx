import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import AdminPagination from '../../components/admin/AdminPagination.jsx';
import ProductCardThumbnail from '../../components/common/ProductCardThumbnail.jsx';
import { Trash2, Plus, Image as ImageIcon, Upload, Eye } from 'lucide-react';
import { getProductImageUrl } from '../../config/env.js';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Modal states
  const [viewProduct, setViewProduct] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

  const [editProduct, setEditProduct] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(null);

  // New Product Form State (with photos support)
  const [newProduct, setNewProduct] = useState({
    name: '',
    code: '',
    sku: '',
    category: 'Shirts',
    price: '',
    description: '',
    isActive: true,
    photos: [] // Array of { title, filename, base64Data }
  });

  // Edit Product Photos Management State
  const [editExistingPhotos, setEditExistingPhotos] = useState([]);
  const [editDeletePhotoIds, setEditDeletePhotoIds] = useState([]);
  const [editNewPhotos, setEditNewPhotos] = useState([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/products');
      setProducts(res.data?.products || res.products || []);
    } catch (err) {
      setError(err.message || 'Failed to load products from Salesforce.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenView = async (productId) => {
    setViewLoading(true);
    setViewProduct(null);
    try {
      const res = await api.get(`/admin/products/${productId}`);
      setViewProduct(res.data?.product || res.product || null);
    } catch (err) {
      alert('Failed to load product details: ' + err.message);
    } finally {
      setViewLoading(false);
    }
  };

  const handleOpenEdit = async (productId) => {
    setEditError(null);
    setEditSuccess(null);
    setEditExistingPhotos([]);
    setEditDeletePhotoIds([]);
    setEditNewPhotos([]);

    try {
      const res = await api.get(`/admin/products/${productId}`);
      const p = res.data?.product || res.product;
      if (p) {
        setEditProduct({
          id: p.id,
          name: p.name || '',
          code: p.code || '',
          sku: p.sku || '',
          category: p.category || 'Shirts',
          price: p.numericPrice || (p.price ? p.price.replace(/[^\d.]/g, '') : ''),
          description: p.description || '',
          isActive: p.isActive !== false
        });
        setEditExistingPhotos(p.imageDetails || []);
      }
    } catch (err) {
      alert('Failed to load product for editing: ' + err.message);
    }
  };

  // Handle Photo File selection for CREATE modal
  const handleCreatePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewProduct((prev) => ({
          ...prev,
          photos: [
            ...prev.photos,
            {
              title: file.name.split('.')[0] || 'Product Photo',
              filename: file.name,
              base64Data: event.target.result
            }
          ]
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeCreatePhoto = (index) => {
    setNewProduct((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  // Handle Photo File selection for EDIT modal
  const handleEditNewPhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditNewPhotos((prev) => [
          ...prev,
          {
            title: file.name.split('.')[0] || 'Product Photo',
            filename: file.name,
            base64Data: event.target.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const markDeleteExistingPhoto = (docId) => {
    setEditDeletePhotoIds((prev) => [...prev, docId]);
    setEditExistingPhotos((prev) => prev.filter((p) => p.documentId !== docId && p.versionId !== docId));
  };

  const removeEditNewPhoto = (index) => {
    setEditNewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editProduct?.id) return;
    setEditSubmitting(true);
    setEditError(null);
    setEditSuccess(null);

    try {
      const res = await api.put(`/admin/products/${editProduct.id}`, {
        name: editProduct.name,
        code: editProduct.code,
        sku: editProduct.sku,
        category: editProduct.category,
        price: editProduct.price,
        description: editProduct.description,
        isActive: editProduct.isActive,
        deletePhotos: editDeletePhotoIds,
        newPhotos: editNewPhotos
      });

      if (res.success || res.status === 200) {
        setEditSuccess('Product & attached photos updated successfully in Salesforce!');
        fetchProducts();
        setTimeout(() => {
          setEditProduct(null);
          setEditSuccess(null);
        }, 1500);
      }
    } catch (err) {
      setEditError(err.message || 'Failed to update product.');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateSubmitting(true);
    setCreateError(null);
    setCreateSuccess(null);

    try {
      const res = await api.post('/admin/products', newProduct);
      if (res.success || res.status === 201) {
        setCreateSuccess('Product & photo attachments created successfully in Salesforce!');
        setNewProduct({
          name: '',
          code: '',
          sku: '',
          category: 'Shirts',
          price: '',
          description: '',
          isActive: true,
          photos: []
        });
        fetchProducts();
        setTimeout(() => {
          setShowCreateModal(false);
          setCreateSuccess(null);
        }, 1500);
      }
    } catch (err) {
      setCreateError(err.message || 'Failed to create product.');
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Compute paginated items
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-black pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Products Management</h1>
          <p className="text-xs text-gray-600">Salesforce Product2 records (Filtered: Is_Custom_Product__c = true)</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setCreateError(null);
              setCreateSuccess(null);
              setShowCreateModal(true);
            }}
            className="border border-black bg-black text-white hover:bg-neutral-800 text-xs font-mono font-bold px-4 py-2 uppercase flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Product</span>
          </button>
          <button
            onClick={fetchProducts}
            className="border border-black bg-white hover:bg-black hover:text-white text-xs font-mono px-3 py-2 uppercase transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-black bg-gray-100 text-xs font-mono text-black">
          {error}
        </div>
      )}

      {/* Table Container */}
      {loading ? (
        <div className="p-8 text-center border border-black font-mono text-xs uppercase bg-white">
          Fetching Custom Products from Salesforce...
        </div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center border border-black font-mono text-xs uppercase bg-white">
          No custom products found in Salesforce (Ensure Is_Custom_Product__c is checked on Product2 records).
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto border border-black bg-white">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-black bg-black text-white uppercase text-[11px]">
                  <th className="py-2.5 px-3">Thumbnail</th>
                  <th className="py-2.5 px-3">Salesforce ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Photos</th>
                  <th className="py-2.5 px-3">Active</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <div className="w-10 h-10 border border-black overflow-hidden bg-gray-100 flex items-center justify-center">
                        {product.imageUrl ? (
                          <img
                            src={getProductImageUrl(product.imageUrl)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[9px] text-gray-500 font-bold">NO IMG</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 font-bold">{product.id}</td>
                    <td className="py-2.5 px-3 font-bold text-black">{product.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="border border-black px-1.5 py-0.5 text-[10px] uppercase">
                        {product.category || 'General'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold">{product.price}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-bold text-gray-700">
                        {product.images?.length || (product.imageUrl ? 1 : 0)} attached
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {product.isActive ? (
                        <span className="text-black font-bold">● YES</span>
                      ) : (
                        <span className="text-gray-400">○ NO</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenView(product.id)}
                        className="border border-black px-2 py-1 text-[11px] uppercase hover:bg-black hover:text-white transition font-bold inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleOpenEdit(product.id)}
                        className="border border-black px-2 py-1 text-[11px] uppercase hover:bg-black hover:text-white transition font-bold"
                      >
                        Edit / Photos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <AdminPagination
            currentPage={currentPage}
            totalItems={products.length}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}

      {/* VIEW PRODUCT MODAL (ALL FIELDS + PHOTO GALLERY) */}
      {(viewProduct || viewLoading) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-black pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Salesforce Product2 Record</span>
                <h2 className="text-xl font-bold uppercase">{viewProduct?.name || 'Loading Product Details...'}</h2>
              </div>
              <button
                onClick={() => setViewProduct(null)}
                className="border border-black px-2 py-1 text-xs font-mono font-bold hover:bg-black hover:text-white"
              >
                ✕ CLOSE
              </button>
            </div>

            {viewLoading ? (
              <div className="py-8 text-center text-xs font-mono uppercase">Retrieving All SObject Fields & Attachments from Salesforce...</div>
            ) : viewProduct ? (
              <div className="space-y-4 text-xs font-mono">
                {/* Photo Attachments Showcase */}
                {viewProduct.images && viewProduct.images.length > 0 && (
                  <div className="border border-black p-3 space-y-2 bg-gray-50">
                    <span className="text-[10px] font-bold uppercase text-gray-700 block">
                      Attached Photos in Notes & Attachments ({viewProduct.images.length})
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {viewProduct.images.map((imgUrl, idx) => {
                        const full = getProductImageUrl(imgUrl);
                        return (
                          <a
                            key={idx}
                            href={full}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="aspect-square border border-black p-1 bg-white hover:scale-105 transition flex items-center justify-center"
                          >
                            <img src={full} alt={`attachment ${idx + 1}`} className="w-full h-full object-cover" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 border border-black p-4 bg-gray-50">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Salesforce Record ID</span>
                    <span className="font-bold text-sm text-black">{viewProduct.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Product Name (Name)</span>
                    <span className="font-bold text-sm text-black">{viewProduct.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Product Code (ProductCode)</span>
                    <span className="font-bold">{viewProduct.code || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Stock Keeping Unit (SKU)</span>
                    <span className="font-bold">{viewProduct.sku || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Family / Category</span>
                    <span className="font-bold">{viewProduct.category || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Price (Product_Price__c)</span>
                    <span className="font-bold text-sm text-black">{viewProduct.price}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Custom Clothing (Is_Custom_Product__c)</span>
                    <span className="font-bold">{viewProduct.isCustom ? 'TRUE' : 'FALSE'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Active Status (IsActive)</span>
                    <span className="font-bold">{viewProduct.isActive ? 'ACTIVE (TRUE)' : 'INACTIVE (FALSE)'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Created Date</span>
                    <span className="text-gray-700">{viewProduct.createdDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Last Modified Date</span>
                    <span className="text-gray-700">{viewProduct.lastModifiedDate}</span>
                  </div>
                </div>

                <div className="border border-black p-4">
                  <span className="text-gray-500 block text-[10px] uppercase mb-1">Description</span>
                  <p className="text-gray-800 text-xs leading-relaxed whitespace-pre-wrap">{viewProduct.description || 'No description entered.'}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* CREATE PRODUCT MODAL (WITH PHOTO ATTACHMENT OPTION) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-black pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Salesforce System of Record</span>
                <h2 className="text-xl font-bold uppercase">Create New Product2</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="border border-black px-2 py-1 text-xs font-mono font-bold hover:bg-black hover:text-white"
              >
                ✕ CLOSE
              </button>
            </div>

            {createError && (
              <div className="p-3 bg-black text-white text-xs font-mono">
                {createError}
              </div>
            )}
            {createSuccess && (
              <div className="p-3 border border-black bg-gray-100 text-black text-xs font-mono font-bold">
                {createSuccess}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block uppercase text-[10px] font-bold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mens Silk Kurta Set"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full border border-black p-2 bg-white text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[10px] font-bold mb-1">Product Code</label>
                  <input
                    type="text"
                    placeholder="BR-PROD-XXX"
                    value={newProduct.code}
                    onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                    className="w-full border border-black p-2 bg-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] font-bold mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="BR-SKU-XXX"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full border border-black p-2 bg-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[10px] font-bold mb-1">Family / Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border border-black p-2 bg-white text-xs focus:outline-none"
                  >
                    <option value="Shirts">Shirts</option>
                    <option value="Trousers">Trousers</option>
                    <option value="Ethnic Wear">Ethnic Wear</option>
                    <option value="Kurtis">Kurtis</option>
                    <option value="Sarees">Sarees</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottom Wear">Bottom Wear</option>
                    <option value="Boys Wear">Boys Wear</option>
                    <option value="Girls Wear">Girls Wear</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase text-[10px] font-bold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="899"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full border border-black p-2 bg-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-[10px] font-bold mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Enter detailed garment and fabric description..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full border border-black p-2 bg-white text-xs focus:outline-none"
                />
              </div>

              {/* Photo Upload Attachment Section */}
              <div className="border border-black p-3 space-y-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <label className="uppercase text-[10px] font-bold flex items-center space-x-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Product Photos (Notes & Attachments)</span>
                  </label>
                  <label className="border border-black bg-white hover:bg-black hover:text-white px-2.5 py-1 text-[10px] font-bold uppercase cursor-pointer transition inline-flex items-center space-x-1">
                    <Upload className="w-3 h-3" />
                    <span>+ Add Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleCreatePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {newProduct.photos.length === 0 ? (
                  <p className="text-[11px] text-gray-500 italic">No photos attached yet. You can attach JPEG/PNG garment photos.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                    {newProduct.photos.map((photo, idx) => (
                      <div key={idx} className="relative border border-black p-1 bg-white aspect-square flex flex-col items-center justify-center group">
                        <img src={photo.base64Data} alt={photo.filename} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeCreatePhoto(idx)}
                          className="absolute top-1 right-1 bg-black text-white p-1 rounded hover:bg-red-700 transition"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <span className="text-[9px] truncate w-full text-center mt-1 block font-mono text-gray-600">
                          {photo.filename}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={newProduct.isActive}
                  onChange={(e) => setNewProduct({ ...newProduct, isActive: e.target.checked })}
                  className="accent-black"
                />
                <label htmlFor="isActiveCheck" className="text-xs uppercase font-bold cursor-pointer">Active in Storefront (IsActive)</label>
              </div>

              <div className="pt-3 border-t border-black flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="border border-black px-4 py-2 uppercase text-xs font-mono hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="bg-black text-white px-6 py-2 uppercase text-xs font-mono font-bold hover:bg-neutral-800 disabled:opacity-50"
                >
                  {createSubmitting ? 'CREATING IN SALESFORCE...' : 'SAVE PRODUCT IN SALESFORCE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL (WITH FULL PHOTO MANAGEMENT & ATTACHMENTS EDITING) */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-black pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Edit Salesforce Product2 Record & Attachments</span>
                <h2 className="text-xl font-bold uppercase">{editProduct.name || 'Edit Product'}</h2>
                <span className="text-[10px] font-mono text-gray-600 block">ID: {editProduct.id}</span>
              </div>
              <button
                onClick={() => setEditProduct(null)}
                className="border border-black px-2 py-1 text-xs font-mono font-bold hover:bg-black hover:text-white"
              >
                ✕ CLOSE
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-black text-white text-xs font-mono">
                {editError}
              </div>
            )}
            {editSuccess && (
              <div className="p-3 border border-black bg-gray-100 text-black text-xs font-mono font-bold">
                {editSuccess}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block uppercase text-[10px] font-bold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  className="w-full border border-black p-2 bg-white text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[10px] font-bold mb-1">Product Code</label>
                  <input
                    type="text"
                    value={editProduct.code}
                    onChange={(e) => setEditProduct({ ...editProduct, code: e.target.value })}
                    className="w-full border border-black p-2 bg-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] font-bold mb-1">SKU</label>
                  <input
                    type="text"
                    value={editProduct.sku}
                    onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })}
                    className="w-full border border-black p-2 bg-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[10px] font-bold mb-1">Family / Category *</label>
                  <select
                    value={editProduct.category}
                    onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                    className="w-full border border-black p-2 bg-white text-xs focus:outline-none"
                  >
                    <option value="Shirts">Shirts</option>
                    <option value="Trousers">Trousers</option>
                    <option value="Ethnic Wear">Ethnic Wear</option>
                    <option value="Kurtis">Kurtis</option>
                    <option value="Sarees">Sarees</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottom Wear">Bottom Wear</option>
                    <option value="Boys Wear">Boys Wear</option>
                    <option value="Girls Wear">Girls Wear</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase text-[10px] font-bold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                    className="w-full border border-black p-2 bg-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-[10px] font-bold mb-1">Description</label>
                <textarea
                  rows="3"
                  value={editProduct.description}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  className="w-full border border-black p-2 bg-white text-xs focus:outline-none"
                />
              </div>

              {/* Photos & Notes/Attachments Management for Existing Product */}
              <div className="border border-black p-3 space-y-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <label className="uppercase text-[10px] font-bold flex items-center space-x-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Manage Attached Photos (Notes & Attachments)</span>
                  </label>
                  <label className="border border-black bg-white hover:bg-black hover:text-white px-2.5 py-1 text-[10px] font-bold uppercase cursor-pointer transition inline-flex items-center space-x-1">
                    <Upload className="w-3 h-3" />
                    <span>+ Upload Photo</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleEditNewPhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Existing Photos List */}
                {editExistingPhotos.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-500 uppercase block font-bold">Existing Attachments in Salesforce:</span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {editExistingPhotos.map((photo) => (
                        <div key={photo.versionId} className="relative border border-black p-1 bg-white aspect-square flex flex-col items-center justify-center">
                          <img
                            src={getProductImageUrl(photo.url)}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => markDeleteExistingPhoto(photo.documentId || photo.versionId)}
                            className="absolute top-1 right-1 bg-black text-white p-1 rounded hover:bg-red-700 transition shadow"
                            title="Delete this attachment from Salesforce"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Newly Staged Photos to Upload */}
                {editNewPhotos.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-black/20">
                    <span className="text-[10px] text-emerald-800 uppercase block font-bold">+ New Photos to Attach on Save:</span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {editNewPhotos.map((photo, idx) => (
                        <div key={idx} className="relative border border-emerald-600 p-1 bg-white aspect-square flex flex-col items-center justify-center">
                          <img src={photo.base64Data} alt={photo.filename} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeEditNewPhoto(idx)}
                            className="absolute top-1 right-1 bg-black text-white p-1 rounded hover:bg-red-700 transition"
                            title="Remove new photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <span className="text-[9px] truncate w-full text-center mt-1 block font-mono text-emerald-700 font-bold">
                            NEW
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {editExistingPhotos.length === 0 && editNewPhotos.length === 0 && (
                  <p className="text-[11px] text-gray-500 italic">No photos currently attached to this product.</p>
                )}

                {editDeletePhotoIds.length > 0 && (
                  <p className="text-[10px] text-red-600 font-bold">
                    {editDeletePhotoIds.length} photo(s) will be permanently deleted from Salesforce upon clicking Save.
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="editIsActiveCheck"
                  checked={editProduct.isActive}
                  onChange={(e) => setEditProduct({ ...editProduct, isActive: e.target.checked })}
                  className="accent-black"
                />
                <label htmlFor="editIsActiveCheck" className="text-xs uppercase font-bold cursor-pointer">Active in Storefront (IsActive)</label>
              </div>

              <div className="pt-3 border-t border-black flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="border border-black px-4 py-2 uppercase text-xs font-mono hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="bg-black text-white px-6 py-2 uppercase text-xs font-mono font-bold hover:bg-neutral-800 disabled:opacity-50"
                >
                  {editSubmitting ? 'UPDATING IN SALESFORCE...' : 'UPDATE PRODUCT IN SALESFORCE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
