import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, Check, ArrowUpDown, Tag, Percent } from 'lucide-react';
import api from '../../services/api.js';
import { useCart } from '../../context/CartContext.jsx';
import ProductCardThumbnail from '../../components/common/ProductCardThumbnail.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const OffersPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  const [addedToastId, setAddedToastId] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products');
        const all = res.data?.products || res.products || [];
        // Show ONLY products with discount percentage > 0
        const discounted = all.filter((p) => Number(p.discountPercent) > 0);
        setProducts(discounted);
      } catch (err) {
        console.error('Failed to load Offers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 'Free Size', 1);
    setAddedToastId(product.id);
    setTimeout(() => setAddedToastId(null), 2000);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return (a.numericPrice || 0) - (b.numericPrice || 0);
    if (sortBy === 'price-high') return (b.numericPrice || 0) - (a.numericPrice || 0);
    if (sortBy === 'discount-high') return (b.discountPercent || 0) - (a.discountPercent || 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Promotional Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-200">
              <Percent className="w-3.5 h-3.5" />
              <span>Direct Store Discounts & Deals</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Special Showroom Offers & Festive Deals
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm">
              Enjoy exclusive showroom discounts across our collection of Men's, Women's, and Kids' readymade garments.
            </p>
          </div>
        </div>

        {/* Header & Sort */}
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-extrabold text-slate-900">
              Active Discount Offers
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-bold shadow-sm">
              {loading ? 'LOADING...' : `${sortedProducts.length} DISCOUNTED ITEMS`}
            </span>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="default">Featured</option>
                <option value="discount-high">Highest Discount %</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <LoadingSpinner message="Loading Showroom Discounts & Festive Offers..." />
        ) : sortedProducts.length === 0 ? (
          <div className="py-20 text-center text-sm text-slate-500 bg-white border border-slate-200 rounded-2xl space-y-3">
            <p className="font-bold text-slate-800">No active discounted garments right now.</p>
            <p className="text-xs text-slate-400">Products with a discount percentage added in Salesforce will appear here automatically.</p>
            <Link to="/shop" className="inline-block mt-2 text-xs font-bold text-amber-700 underline">
              Browse All Products in Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                <div className="relative">
                  <Link to={`/products/${product.id}`} className="block">
                    <ProductCardThumbnail product={product} heightClass="h-48" />
                  </Link>
                  <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
                    {product.discountPercent}% OFF
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {product.category}
                    </span>
                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 line-clamp-2 transition leading-snug mt-0.5">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {product.description || `Special offer on ${product.category} readymade garment.`}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-lg font-black text-rose-600">{product.price}</span>
                        {product.originalPrice > product.numericPrice && (
                          <span className="text-xs text-slate-400 line-through ml-2">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        Save {product.discountPercent}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="w-full text-center border border-slate-300 hover:border-slate-800 text-slate-800 text-xs font-bold py-2 rounded-lg transition"
                      >
                        View Details
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`w-full text-xs font-bold py-2 rounded-lg flex items-center justify-center space-x-1 transition shadow-sm ${
                          addedToastId === product.id
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {addedToastId === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
