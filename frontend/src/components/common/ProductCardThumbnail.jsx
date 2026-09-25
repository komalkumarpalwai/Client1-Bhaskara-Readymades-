import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { getProductImageUrl } from '../../config/env.js';

/**
 * ProductCardThumbnail
 * Renders the live Salesforce ContentVersion image if attached,
 * with graceful fallback to category-styled emblem card if no image attached.
 */
const ProductCardThumbnail = ({ product, heightClass = 'h-48' }) => {
  const [imageError, setImageError] = useState(false);

  const hasSalesforceImage = Boolean(product?.imageUrl && !imageError);
  const imageUrl = getProductImageUrl(product?.imageUrl);

  return (
    <div className={`relative w-full ${heightClass} bg-gradient-to-br from-slate-50 to-amber-50/40 flex items-center justify-center overflow-hidden border-b border-slate-100`}>
      {/* Category Pill */}
      <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm border border-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs">
        {product?.category || 'Garment'}
      </div>

      {/* Code / SKU Pill */}
      <div className="absolute bottom-2 right-3 z-10 text-[10px] font-mono text-slate-400 bg-white/80 px-1.5 py-0.5 rounded">
        {product?.code || product?.sku || ''}
      </div>

      {hasSalesforceImage ? (
        <img
          src={imageUrl}
          alt={product.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      ) : (
        <div className="text-center p-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white border border-amber-200 shadow-sm flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
            <ShoppingBag className="w-10 h-10 text-amber-700" />
          </div>
          <span className="text-[10px] font-mono text-slate-400 block mt-2">Bhaskara Quality</span>
        </div>
      )}
    </div>
  );
};

export default ProductCardThumbnail;
