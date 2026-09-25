import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  ShoppingBag, 
  Check, 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Share2, 
  Tag, 
  Info,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  MessageCircle
} from 'lucide-react';

import api from '../../services/api.js';
import { useCart } from '../../context/CartContext.jsx';
import { getProductImageUrl } from '../../config/env.js';

const SIZES_BY_CATEGORY = {
  Shirts: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)', '46 (XXL)'],
  Trousers: ['30', '32', '34', '36', '38', '40'],
  'Ethnic Wear': ['38 (M)', '40 (L)', '42 (XL)', '44 (XXL)'],
  Kurtis: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
  Sarees: ['6.3 Meters (With Blouse Piece)'],
  Dresses: ['S', 'M', 'L', 'XL'],
  Tops: ['S', 'M', 'L', 'XL'],
  'Bottom Wear': ['Free Size', 'L', 'XL', 'XXL'],
  'Boys Wear': ['2-3 Yrs', '4-5 Yrs', '6-7 Yrs', '8-9 Yrs', '10-12 Yrs'],
  'Girls Wear': ['2-3 Yrs', '4-5 Yrs', '6-7 Yrs', '8-9 Yrs', '10-12 Yrs']
};

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const detailsContainerRef = useRef(null);

  // GSAP animation for product details entrance
  useGSAP(() => {
    if (!loading && product) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.7 } });
      tl.from('.gsap-detail-gallery', { opacity: 0, x: -30, duration: 0.8 })
        .from('.gsap-detail-badge', { opacity: 0, y: -10, duration: 0.4 }, '-=0.5')
        .from('.gsap-detail-title', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from('.gsap-detail-price', { opacity: 0, y: 15, duration: 0.5 }, '-=0.4')
        .from('.gsap-detail-sizes', { opacity: 0, y: 15, duration: 0.5 }, '-=0.3')
        .from('.gsap-detail-actions', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
        .from('.gsap-detail-features', { opacity: 0, y: 15, duration: 0.5 }, '-=0.3');
    }
  }, { dependencies: [loading, product?.id], scope: detailsContainerRef });

  // GSAP image swap effect
  useGSAP(() => {
    if (product) {
      gsap.fromTo('.gsap-active-img', 
        { opacity: 0.6, scale: 0.98 }, 
        { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, { dependencies: [selectedImageIndex], scope: detailsContainerRef });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/products/${productId}`);
        const p = res.data?.product || res.product;
        if (p) {
          setProduct(p);
          setSelectedImageIndex(0);
          const availableSizes = SIZES_BY_CATEGORY[p.category] || ['Free Size', 'S', 'M', 'L', 'XL'];
          setSelectedSize(availableSizes[0]);
        } else {
          setError('Product not found in catalogue.');
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve product details.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-amber-600 border-t-transparent mb-4"></div>
        <p className="text-slate-600 font-mono text-sm uppercase tracking-widest">
          Loading Garment Details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
          <h2 className="text-lg font-bold">Item Not Found</h2>
          <p className="text-sm mt-1">{error || 'This product does not exist or has been removed.'}</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-amber-700 hover:text-amber-800 underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>
      </div>
    );
  }

  const availableSizes = SIZES_BY_CATEGORY[product.category] || ['Free Size', 'S', 'M', 'L', 'XL'];
  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : (product.imageUrl ? [product.imageUrl] : []);

  const activeImage = galleryImages[selectedImageIndex] || product.imageUrl;

  const handlePrevImage = () => {
    if (galleryImages.length <= 1) return;
    setSelectedImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (galleryImages.length <= 1) return;
    setSelectedImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-amber-700">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-amber-700">Catalogue</Link>
          <span>/</span>
          <span className="text-slate-400">{product.category || 'Garments'}</span>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Details Main Card */}
        <div ref={detailsContainerRef} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-10">
          
          {/* Left: Product Visual Presentation (Multi-image Hero Gallery) */}
          <div className="gsap-detail-gallery lg:col-span-6 flex flex-col space-y-4">
            
            {/* Main Stage Image Container */}
            <div className="relative w-full aspect-square bg-slate-950/5 rounded-2xl border border-slate-200/80 overflow-hidden flex items-center justify-center group shadow-inner">
              
              {/* Category Stamp Badge */}
              <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-sm text-white text-[11px] font-mono uppercase px-3 py-1 rounded-full shadow-sm flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{product.category || 'Bhaskara Special'}</span>
              </div>

              {/* In-Stock Status Badge */}
              <div className="absolute top-4 right-4 z-10 bg-emerald-100/90 backdrop-blur-sm text-emerald-800 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse"></span>
                <span>In Stock & Ready for Delivery</span>
              </div>

              {/* Main Full Image */}
              {activeImage ? (
                <img
                  src={getProductImageUrl(activeImage)}
                  alt={product.name}
                  className="gsap-active-img w-full h-full object-contain p-2 transition-all duration-300 transform group-hover:scale-105"
                />
              ) : (
                <div className="text-center space-y-4 z-10 p-8">
                  <div className="w-32 h-32 mx-auto rounded-3xl bg-white border border-amber-200 shadow-md flex items-center justify-center p-4 transform group-hover:scale-105 transition-transform duration-300">
                    <ShoppingBag className="w-16 h-16 text-amber-700" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono uppercase text-slate-400">Authentic Readymade Garment</span>
                    <p className="text-sm font-semibold text-slate-700 max-w-sm px-4">
                      Bhaskara Readymades Quality Assurance
                    </p>
                  </div>
                </div>
              )}

              {/* Carousel Arrows if multiple images */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md hover:scale-110 transition-all z-20"
                    aria-label="Previous Image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md hover:scale-110 transition-all z-20"
                    aria-label="Next Image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Bottom SKU / Code pill */}
              <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-600 text-[10px] font-mono px-2.5 py-1 rounded-md shadow-sm">
                Code: {product.code || product.sku || 'BR-GARMENT'}
              </div>

              {/* Image Counter Badge if multiple images */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-3 right-3 z-10 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-mono px-2.5 py-1 rounded-md shadow-sm">
                  {selectedImageIndex + 1} / {galleryImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip Gallery */}
            {galleryImages.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold font-mono text-slate-600 uppercase tracking-wider">
                    Garment Photo Gallery ({galleryImages.length})
                  </span>
                  <span className="text-[11px] text-slate-400">Click to preview in full</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5 overflow-x-auto pb-1">
                  {galleryImages.map((imgUrl, idx) => {
                    const isSelected = selectedImageIndex === idx;
                    const fullSrc = getProductImageUrl(imgUrl);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-1 bg-white flex items-center justify-center ${
                          isSelected
                            ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/20 scale-105'
                            : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={fullSrc}
                          alt={`${product.name} preview ${idx + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-600/10 pointer-events-none rounded-lg" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Product Header */}
              <div>
                <div className="gsap-detail-badge flex items-center space-x-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{product.category || 'Garment Collection'}</span>
                </div>
                <h1 className="gsap-detail-title text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {product.name}
                </h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Item Code: {product.code || product.sku || 'BR-GARMENT'}
                </p>
              </div>

              {/* Price Banner */}
              <div className="gsap-detail-price p-4 bg-gradient-to-r from-amber-50/80 to-orange-50/50 border border-amber-200 rounded-2xl flex items-baseline space-x-3">
                <span className="text-3xl font-black text-slate-900">
                  {product.price}
                </span>
                <span className="text-xs text-slate-500 font-medium line-through">
                  ₹{Math.round((product.numericPrice || 999) * 1.35)}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Special Store Price
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  <span>Garment & Fabric Description</span>
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                  {product.description ||
                    `${product.name} - Premium quality readymade clothing crafted with durable fabrics and comfort stitching for everyday wear and festive occasions.`}
                </p>
              </div>

              {/* Size Selector */}
              <div className="gsap-detail-sizes space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Select Size: <span className="text-amber-700 font-mono font-bold">{selectedSize}</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Regular Indian Fit</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                        selectedSize === size
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <div className="inline-flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 text-sm font-bold transition"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-xs font-mono font-bold text-slate-900 min-w-[2.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 text-sm font-bold transition"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-500">
                    Total: <strong className="text-slate-900">₹{(product.numericPrice || 0) * quantity}</strong>
                  </span>
                </div>
              </div>

            </div>

            {/* Action Buttons & Feedback */}
            <div className="gsap-detail-actions space-y-3 pt-4 border-t border-slate-200">
              {addedToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Added {quantity} x {product.name} ({selectedSize}) to your bag!</span>
                  </div>
                  <Link to="/cart" className="underline text-emerald-900 font-bold hover:text-emerald-950">
                    View Bag
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Direct Order on WhatsApp Button */}
              <button
                type="button"
                onClick={() => {
                  const text = `Hi Bhaskara Readymades, I want to order / inquire about "${product.name}" (Size: ${selectedSize || 'Free Size'}, Qty: ${quantity}, Price: ${product.price}). Can you please assist me?`;
                  window.open(`https://wa.me/918309897937?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Buy / Inquire on WhatsApp (+91 8309897937)</span>
              </button>


              {/* Service Assurance Badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 text-center border-t border-slate-100">
                <div className="p-2.5 bg-slate-50 rounded-xl flex flex-col items-center">
                  <Truck className="w-4 h-4 text-amber-700 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-700">Fast Doorstep Delivery</span>
                  <span className="text-[9px] text-slate-400">All India & Local Dispatch</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-amber-700 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-700">100% Authentic Fabric</span>
                  <span className="text-[9px] text-slate-400">Bhaskara Certified</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-amber-700 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-700">Easy Size Exchange</span>
                  <span className="text-[9px] text-slate-400">Hassle-Free Support</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailsPage;
