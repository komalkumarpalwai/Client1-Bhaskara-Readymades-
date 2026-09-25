import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, Check, ArrowUpDown } from 'lucide-react';
import api from '../../services/api.js';
import { useCart } from '../../context/CartContext.jsx';
import ProductCardThumbnail from '../../components/common/ProductCardThumbnail.jsx';
import StorefrontPagination from '../../components/common/StorefrontPagination.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const WOMEN_CATEGORIES = ['All Women', 'Kurtis', 'Sarees', 'Dresses', 'Tops', 'Bottom Wear'];

const WomenPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubCat, setSelectedSubCat] = useState('All Women');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;
  const [addedToastId, setAddedToastId] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products');
        const all = res.data?.products || res.products || [];
        const womenItems = all.filter((p) =>
          ['Kurtis', 'Sarees', 'Dresses', 'Tops', 'Bottom Wear'].includes(p.category)
        );
        setProducts(womenItems);
      } catch (err) {
        console.error('Failed to load Women products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubCatChange = (cat) => {
    setSelectedSubCat(cat);
    setCurrentPage(1);
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 'Free Size', 1);
    setAddedToastId(product.id);
    setTimeout(() => setAddedToastId(null), 2000);
  };

  const filteredProducts = products
    .filter((p) => {
      if (selectedSubCat === 'All Women') return true;
      return p.category === selectedSubCat;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.numericPrice || 0) - (b.numericPrice || 0);
      if (sortBy === 'price-high') return (b.numericPrice || 0) - (a.numericPrice || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold font-mono text-pink-700 uppercase tracking-widest flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ethnic & Contemporary Fashion</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Women's Readymade Wear
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Designer Sarees, Cotton & Silk Kurtis, Dresses, Tops & Leggings from our Saripalli showroom.
            </p>
          </div>

          <div className="text-xs font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-bold shadow-sm">
            {loading ? 'LOADING...' : `${filteredProducts.length} PRODUCTS`}
          </div>
        </div>

        {/* Filter Pills & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {WOMEN_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleSubCatChange(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSubCat === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <span className="text-xs font-bold text-slate-600 flex items-center space-x-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <LoadingSpinner message="Loading Women's Ethnic & Daily Wear..." />
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-sm text-slate-500 bg-white border border-slate-200 rounded-2xl space-y-3">
            <p className="font-bold text-slate-800">No garments found in this category.</p>
            <Link to="/shop" className="text-xs font-bold text-pink-700 underline">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-slate-200 hover:border-pink-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  <Link to={`/products/${product.id}`} className="block">
                    <ProductCardThumbnail product={product} heightClass="h-48" />
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-pink-700 line-clamp-2 transition leading-snug">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {product.description || `Exquisite ${product.category} for festive and casual wear.`}
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

            {/* Pagination Controls */}
            <StorefrontPagination
              currentPage={currentPage}
              totalItems={filteredProducts.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WomenPage;
