import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShoppingBag, Search as SearchIcon, Sparkles, Check, ArrowUpDown } from 'lucide-react';
import api from '../../services/api.js';
import { useCart } from '../../context/CartContext.jsx';
import ProductCardThumbnail from '../../components/common/ProductCardThumbnail.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
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
        setProducts(all);
      } catch (err) {
        console.error('Failed to load products for search:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 'Free Size', 1);
    setAddedToastId(product.id);
    setTimeout(() => setAddedToastId(null), 2000);
  };

  const cleanQuery = query.trim().toLowerCase();

  const filteredProducts = products
    .filter((p) => {
      if (!cleanQuery) return true;
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const code = (p.code || '').toLowerCase();
      return name.includes(cleanQuery) || desc.includes(cleanQuery) || cat.includes(cleanQuery) || code.includes(cleanQuery);
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.numericPrice || 0) - (b.numericPrice || 0);
      if (sortBy === 'price-high') return (b.numericPrice || 0) - (a.numericPrice || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold font-mono text-indigo-700 uppercase tracking-widest flex items-center space-x-1.5">
              <SearchIcon className="w-3.5 h-3.5" />
              <span>Live Storefront Search</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {cleanQuery ? `Search Results for "${query}"` : 'All Products Catalogue'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing matching apparel directly from our showroom catalogue.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-bold shadow-sm">
              {loading ? 'SEARCHING...' : `${filteredProducts.length} MATCHES`}
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
                <option value="default">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <LoadingSpinner message={`Searching store products for "${query}"...`} />
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-sm text-slate-500 bg-white border border-slate-200 rounded-2xl space-y-3">
            <p className="font-bold text-slate-800">No products found matching "{query}".</p>
            <p className="text-xs text-slate-500">Try searching for keywords like "Shirt", "Saree", "Kurti", or "Kids".</p>
            <Link to="/shop" className="text-xs font-bold text-indigo-700 underline inline-block pt-2">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                <Link to={`/products/${product.id}`} className="block">
                  <ProductCardThumbnail product={product} heightClass="h-48" />
                </Link>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {product.category}
                    </span>
                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 line-clamp-2 transition leading-snug mt-0.5">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {product.description || `High quality ${product.category} readymade garment.`}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-lg font-black text-slate-900">{product.price}</span>
                        {product.originalPrice > product.numericPrice && (
                          <span className="text-[11px] text-slate-400 line-through ml-2">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      {product.discountPercent > 0 ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                          {product.discountPercent}% OFF
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Available
                        </span>
                      )}
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

export default SearchPage;
