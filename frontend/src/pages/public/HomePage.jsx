import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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

  // GSAP animation container refs
  const heroContainerRef = useRef(null);
  const productGridRef = useRef(null);
  const showcaseRef = useRef(null);

  // Hero Section GSAP entrance timeline
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });

    tl.from('.gsap-hero-badge', { y: -15, opacity: 0, duration: 0.6 })
      .from('.gsap-hero-title', { y: 25, opacity: 0, duration: 0.8 }, '-=0.3')
      .from('.gsap-hero-desc', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')
      .from('.gsap-hero-cta', { y: 20, opacity: 0, stagger: 0.12, duration: 0.6 }, '-=0.4');
  }, { scope: heroContainerRef });

  // Product Grid Staggered GSAP Reveal on loading finish or tab change
  useGSAP(() => {
    if (!loading && products.length > 0) {
      gsap.from('.gsap-product-card', {
        y: 35,
        opacity: 0,
        stagger: 0.08,
        duration: 0.65,
        ease: 'power2.out',
        clearProps: 'transform,opacity'
      });
    }
  }, { dependencies: [loading, activeTab, currentPage], scope: productGridRef });

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
      {/* CLEAN & SPACIOUS FASHION HERO SECTION */}
      <section ref={heroContainerRef} className="relative overflow-hidden min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex items-center">
        {/* Full High-Resolution Family Fashion Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transform scale-100 transition-transform duration-700"
          style={{ backgroundImage: `url("${showroomBanner}")` }}
        ></div>

        {/* Subtle Warm / Neutral Ambient Gradient Overlay (Preserves Full Image Visibility) */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent sm:w-3/4 lg:w-3/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-24 w-full">
          <div className="max-w-2xl space-y-5 text-left text-white">
            
            {/* Small Badge */}
            <div className="gsap-hero-badge inline-flex items-center space-x-2 bg-amber-400/25 backdrop-blur-md border border-amber-300/40 text-amber-200 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Bhaskara Readymades</span>
            </div>

            {/* Main Heading */}
            <h1 className="gsap-hero-title text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] drop-shadow-md">
              Style for Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-orange-300">Generation</span>
            </h1>

            {/* Supporting Text */}
            <p className="gsap-hero-desc text-slate-100 text-base sm:text-lg leading-relaxed font-medium drop-shadow max-w-xl">
              Discover quality men's, women's and kids' readymade clothing for every occasion.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <Link
                to="/shop"
                className="gsap-hero-cta bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 hover:shadow-xl"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Collection</span>
              </Link>

              <a
                href="#featured-collections"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('featured-collections')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="gsap-hero-cta border-2 border-white/40 hover:border-white bg-black/30 backdrop-blur-md hover:bg-black/50 text-white font-bold px-7 py-3.5 rounded-xl text-sm flex items-center justify-center space-x-2 transition shadow-md hover:-translate-y-0.5"
              >
                <span>Explore Categories</span>
                <ChevronRight className="w-4 h-4" />
              </a>
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
          <div ref={productGridRef} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedFeatured.map((product) => (
                <div
                  key={product.id}
                  className="gsap-product-card bg-white border border-slate-200 hover:border-amber-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
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
