import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, Check, ArrowLeft } from 'lucide-react';
import api from '../../services/api.js';
import { useCart } from '../../context/CartContext.jsx';
import ProductCardThumbnail from '../../components/common/ProductCardThumbnail.jsx';

const CATEGORY_MAP = {
  men: ['Shirts', 'Trousers', 'Ethnic Wear'],
  women: ['Kurtis', 'Sarees', 'Dresses', 'Tops', 'Bottom Wear'],
  kids: ['Boys Wear', 'Girls Wear'],
  shirts: ['Shirts'],
  trousers: ['Trousers'],
  kurtis: ['Kurtis'],
  sarees: ['Sarees'],
  dresses: ['Dresses']
};

const CategoryPage = () => {
  const { category = '' } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToastId, setAddedToastId] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products');
        const all = res.data?.products || res.products || [];
        const validFamilies = CATEGORY_MAP[category.toLowerCase()] || [category];
        const filtered = all.filter((p) =>
          validFamilies.some((f) => f.toLowerCase() === p.category?.toLowerCase())
        );
        setProducts(filtered.length > 0 ? filtered : all);
      } catch (err) {
        console.error('Failed to load category products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category]);

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 'Free Size', 1);
    setAddedToastId(product.id);
    setTimeout(() => setAddedToastId(null), 2000);
  };

  const title = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold font-mono text-amber-700 uppercase tracking-widest flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Category Collection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 capitalize">
              {title} Readymades
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Authentic readymade garments from Bhaskara Readymades.
            </p>
          </div>

          <div className="text-xs font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-bold shadow-sm">
            {loading ? 'LOADING...' : `${products.length} PRODUCTS`}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent"></div>
            <p className="text-xs font-mono uppercase text-slate-500">Loading {title} Garments...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-sm text-slate-500 bg-white border border-slate-200 rounded-2xl space-y-3">
            <p className="font-bold text-slate-800">No garments found in this category.</p>
            <Link to="/shop" className="text-xs font-bold text-amber-700 underline">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                <Link to={`/products/${product.id}`} className="block">
                  <ProductCardThumbnail product={product} heightClass="h-48" />
                </Link>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 line-clamp-2 transition leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {product.description || `High-quality ${product.category} readymade garment.`}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-lg font-black text-slate-900">{product.price}</span>
                        <span className="text-[11px] text-slate-400 line-through ml-2">
                          ₹{Math.round((product.numericPrice || 999) * 1.35)}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Available
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

export default CategoryPage;
