import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  ShoppingBag, 
  Sparkles, 
  Check, 
  Filter, 
  ArrowUpDown, 
  Search 
} from 'lucide-react';
import api from '../../services/api.js';
import { useCart } from '../../context/CartContext.jsx';
import ProductCardThumbnail from '../../components/common/ProductCardThumbnail.jsx';
import StorefrontPagination from '../../components/common/StorefrontPagination.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const CATEGORIES = [
  'All',
  'Boys Wear',
  'Girls Wear',
  'Kurtis',
  'Sarees',
  'Dresses',
  'Tops',
  'Bottom Wear',
  'Ethnic Wear',
  'Night Wear',
  'Shirts',
  'Trousers'
];

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;
  const [addedToastId, setAddedToastId] = useState(null);

  const { addToCart } = useCart();
  const shopGridRef = useRef(null);

  // GSAP animation for product grid on filter / category / page change
  useGSAP(() => {
    if (!loading && products.length > 0) {
      gsap.from('.gsap-shop-card', {
        y: 30,
        opacity: 0,
        stagger: 0.06,
        duration: 0.6,
        ease: 'power2.out',
        clearProps: 'transform,opacity'
      });
    }
  }, { dependencies: [loading, selectedCategory, searchFilter, sortBy, currentPage], scope: shopGridRef });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/products');
        setProducts(res.data?.products || res.products || []);
      } catch (err) {
        setError('Failed to retrieve products from Salesforce catalogue.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 'Free Size', 1);
    setAddedToastId(product.id);
    setTimeout(() => setAddedToastId(null), 2000);
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = !searchFilter.trim() || 
        p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (p.code && p.code.toLowerCase().includes(searchFilter.toLowerCase()));
      return matchesCategory && matchesSearch;
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
        
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold font-mono text-amber-700 uppercase tracking-widest flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Store Catalogue</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Shop Readymade Garments
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live products synced directly from Bhaskara Readymades showroom catalogue.
            </p>
          </div>

          <div className="text-xs font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-bold self-start sm:self-auto shadow-sm">
            {loading ? 'LOADING...' : `SHOWING ${filteredProducts.length} OF ${products.length} PRODUCTS`}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search garments by name or code..."
              value={searchFilter}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-slate-600 flex items-center space-x-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort By:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-slate-800"
            >
              <option value="default">Default Order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <LoadingSpinner message="Retrieving Garment Catalogue from Salesforce..." />
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-sm text-slate-500 bg-white border border-slate-200 rounded-2xl space-y-3">
            <p className="font-bold text-slate-800">No garments found matching your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchFilter('');
                setCurrentPage(1);
              }}
              className="text-xs font-bold text-amber-700 underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div ref={shopGridRef} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="gsap-shop-card bg-white border border-slate-200 hover:border-amber-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Visual Header / Thumbnail Image */}
                  <Link to={`/products/${product.id}`} className="block">
                    <ProductCardThumbnail product={product} heightClass="h-48" />
                  </Link>

                  {/* Details Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 line-clamp-2 transition leading-snug">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {product.description || `Authentic ${product.category} readymade garment.`}
                      </p>
                    </div>

                    {/* Price & Add to Cart */}
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

export default ShopPage;
