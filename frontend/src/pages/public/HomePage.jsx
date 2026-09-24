import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Sparkles, 
  Tag, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Star,
  ChevronRight,
  Filter
} from 'lucide-react';
import api from '../../services/api.js';
import { useCart } from '../../context/CartContext.jsx';
import ProductCardThumbnail from '../../components/common/ProductCardThumbnail.jsx';
import StorefrontPagination from '../../components/common/StorefrontPagination.jsx';
import { showroomBanner } from '../../assets/index.js';

const CATEGORY_GROUPS = [
  { id: 'all', name: 'All Collections' },
  { id: 'shirts', name: 'Men - Shirts', filter: ['Shirts'] },
  { id: 'ethnic', name: 'Ethnic & Festive', filter: ['Ethnic Wear', 'Sarees'] },
  { id: 'women', name: "Women's Kurtis & Dresses", filter: ['Kurtis', 'Dresses', 'Tops', 'Bottom Wear'] },
  { id: 'kids', name: "Kids' Readymades", filter: ['Boys Wear', 'Girls Wear'] }
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;
  const [addedToastId, setAddedToastId] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products');
        setProducts(res.data?.products || res.products || []);
      } catch (err) {
        setError('Unable to load clothing products at this moment.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 'Free Size', 1);
    setAddedToastId(product.id);
    setTimeout(() => setAddedToastId(null), 2000);
  };

  // Filter products according to activeTab
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    const group = CATEGORY_GROUPS.find((g) => g.id === activeTab);
    return group?.filter?.includes(p.category);
  });

  const paginatedFeatured = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Category carousels / showcases
  const mensProducts = products.filter((p) => ['Shirts', 'Trousers', 'Ethnic Wear'].includes(p.category));
  const womensProducts = products.filter((p) => ['Kurtis', 'Sarees', 'Dresses', 'Tops', 'Bottom Wear'].includes(p.category));
  const kidsProducts = products.filter((p) => ['Boys Wear', 'Girls Wear'].includes(p.category));

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION WITH SHOWROOM BACKGROUND IMAGE */}
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-[580px] sm:min-h-[640px] flex items-center">
        {/* Full-width High Resolution Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat scale-105 transform motion-safe:transition-transform duration-1000"
          style={{ backgroundImage: `url("${showroomBanner}")` }}
        ></div>

        {/* Multi-layered Premium Dark Vignette & Glass Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-amber-400/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premier Readymade Showroom in Saripalli</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-md">
                Bhaskara <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-orange-400">Readymades</span>
              </h1>

              <p className="text-slate-200 text-sm sm:text-base max-w-2xl leading-relaxed drop-shadow">
                Experience authentic, high-quality family clothing. Featuring exclusive Men’s Shirts & Kurtas, Women’s Designer Sarees & Kurtis, and vibrant Kids' Wear directly from our Ganapavaram store.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore Catalogue ({products.length} Items)</span>
                </Link>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto border border-white/20 hover:border-white/40 bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/80 text-white font-semibold px-6 py-3.5 rounded-xl text-sm flex items-center justify-center space-x-2 transition shadow-lg"
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Store Directions</span>
                </Link>
              </div>

              {/* Badges Bar */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 backdrop-blur-sm p-2 rounded-xl border border-white/5">
                  <div className="text-base sm:text-lg font-bold text-amber-300">100% Cotton</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300">Comfort Tested</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-2 rounded-xl border border-white/5">
                  <div className="text-base sm:text-lg font-bold text-amber-300">Best Price</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300">Direct From Mills</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-2 rounded-xl border border-white/5">
                  <div className="text-base sm:text-lg font-bold text-amber-300">Saripalli, AP</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300">Ganapavaram 534198</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Display (Live Top Categories & Fast Showcase) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-amber-400 border-b border-white/10 pb-3">
                  <span className="flex items-center space-x-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>POPULAR STORE CATEGORIES</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>LIVE SYNC</span>
                  </span>
                </div>

                {/* Dynamic Category List */}
                <div className="space-y-2.5">
                  {[
                    { 
                      id: 'men', 
                      name: "Men's Collection", 
                      sub: "Formal Shirts, Kurtas & Trousers", 
                      link: "/category/men",
                      tabId: "shirts",
                      badge: "MEN",
                      color: "from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-400/30",
                      count: products.filter(p => ['Shirts', 'Trousers', 'Ethnic Wear'].includes(p.category)).length || 12
                    },
                    { 
                      id: 'women', 
                      name: "Women's Collection", 
                      sub: "Designer Sarees, Kurtis & Dresses", 
                      link: "/category/women",
                      tabId: "women",
                      badge: "WOMEN",
                      color: "from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-400/30",
                      count: products.filter(p => ['Kurtis', 'Sarees', 'Dresses', 'Tops', 'Bottom Wear'].includes(p.category)).length || 18
                    },
                    { 
                      id: 'kids', 
                      name: "Kids' Readymades", 
                      sub: "Boys & Girls Festive Wear", 
                      link: "/category/kids",
                      tabId: "kids",
                      badge: "KIDS",
                      color: "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-400/30",
                      count: products.filter(p => ['Boys Wear', 'Girls Wear'].includes(p.category)).length || 8
                    },
                    { 
                      id: 'ethnic', 
                      name: "Ethnic & Festive Sarees", 
                      sub: "Traditional Silk & Handloom Wear", 
                      link: "/category/women",
                      tabId: "ethnic",
                      badge: "ETHNIC",
                      color: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-400/30",
                      count: products.filter(p => ['Ethnic Wear', 'Sarees'].includes(p.category)).length || 10
                    }
                  ].map((cat) => (
                    <Link
                      key={cat.id}
                      to={cat.link}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center font-black text-[11px] border group-hover:scale-105 transition-transform`}>
                          {cat.badge}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                            {cat.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 line-clamp-1">{cat.sub}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-amber-300">
                        <span>{cat.count} Items</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="text-center pt-1">
                  <a
                    href="#featured-collections"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('featured-collections')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Browse {products.length} live garments below</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORY TABS & FILTERED SHOWCASE */}
      <section id="featured-collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-bold font-mono text-amber-700 uppercase tracking-widest flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Browse Garment Catalogue</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Collections
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORY_GROUPS.map((group) => (
              <button
                key={group.id}
                onClick={() => handleTabChange(group.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === group.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent"></div>
            <p className="text-xs font-mono uppercase text-slate-500">Retrieving Live Garments Catalogue...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-2xl">
            No products found in this category collection.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedFeatured.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
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
                        {product.description || `High-quality ${product.category} readymade garment.`}
                      </p>
                    </div>

                    {/* Price & Add to Cart */}
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

            {/* Storefront Pagination */}
            <StorefrontPagination
              currentPage={currentPage}
              totalItems={filteredProducts.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </section>

      {/* MEN'S COLLECTION SHOWCASE ROW */}
      {mensProducts.length > 0 && (
        <section className="bg-slate-100 py-12 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-amber-700">Gentlemen's Wardrobe</span>
                <h2 className="text-2xl font-extrabold text-slate-900">Men's Shirts & Ethnic Collection</h2>
              </div>
              <Link to="/category/men" className="text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center space-x-1">
                <span>View All ({mensProducts.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {mensProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <Link to={`/products/${product.id}`} className="block">
                    <ProductCardThumbnail product={product} heightClass="h-40" />
                  </Link>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        {product.category}
                      </span>
                      <Link to={`/products/${product.id}`}>
                        <h4 className="text-sm font-bold text-slate-900 hover:text-amber-700 line-clamp-1">
                          {product.name}
                        </h4>
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-1">{product.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="font-extrabold text-slate-900">{product.price}</span>
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3 py-1.5 rounded-md font-semibold flex items-center space-x-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WOMEN'S COLLECTION SHOWCASE ROW */}
      {womensProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-amber-700">Ethnic & Contemporary</span>
              <h2 className="text-2xl font-extrabold text-slate-900">Women's Sarees, Kurtis & Dresses</h2>
            </div>
            <Link to="/category/women" className="text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center space-x-1">
              <span>View All ({womensProducts.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {womensProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <Link to={`/products/${product.id}`} className="block">
                  <ProductCardThumbnail product={product} heightClass="h-40" />
                </Link>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                    <Link to={`/products/${product.id}`}>
                      <h4 className="text-sm font-bold text-slate-900 hover:text-amber-700 line-clamp-1">
                        {product.name}
                      </h4>
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-1">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="font-extrabold text-slate-900">{product.price}</span>
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3 py-1.5 rounded-md font-semibold flex items-center space-x-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* KIDS' COLLECTION SHOWCASE ROW */}
      {kidsProducts.length > 0 && (
        <section className="bg-amber-50/50 py-12 border-y border-amber-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-amber-700">Joyful Readymades</span>
                <h2 className="text-2xl font-extrabold text-slate-900">Kids' Boys & Girls Wear</h2>
              </div>
              <Link to="/category/kids" className="text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center space-x-1">
                <span>View All ({kidsProducts.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {kidsProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <Link to={`/products/${product.id}`} className="block">
                    <ProductCardThumbnail product={product} heightClass="h-40" />
                  </Link>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase bg-orange-50 text-orange-800 px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                      <Link to={`/products/${product.id}`}>
                        <h4 className="text-sm font-bold text-slate-900 hover:text-amber-700 line-clamp-1">
                          {product.name}
                        </h4>
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-1">{product.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="font-extrabold text-slate-900">{product.price}</span>
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3 py-1.5 rounded-md font-semibold flex items-center space-x-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STORE VISIT & TRUST PROMISES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-3 mx-auto sm:mx-0">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Visit Our Saripalli Showroom</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sivalayam Street, Saripalli, Ganapavaram, AP - 534198. Open all 7 days with personal fitting assistance.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-3 mx-auto sm:mx-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Direct Mill Sourced</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authentic textiles directly from leading weavers and garment manufacturing hubs across India.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-3 mx-auto sm:mx-0">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Fast In-Store Dispatch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Immediate order fulfillment, trial options, and seamless size exchanges right at our counter.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
