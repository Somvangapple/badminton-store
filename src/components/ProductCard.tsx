import React from 'react';
import { Product } from '../types';
import { formatKip } from '../data/initialData';
import { ShoppingCart, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
}) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-[#072c1c] rounded-2xl border border-emerald-800/80 hover:border-orange-500/80 transition-all duration-200 overflow-hidden shadow-lg flex flex-col justify-between hover:-translate-y-1">
      {/* Image Container with Zoom effect */}
      <div
        className="relative aspect-[4/3] bg-[#03150c] overflow-hidden cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Brand Kicker */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-emerald-700/60 text-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded">
          {product.brand}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {product.stock > 5 ? (
            <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ພ້ອມສົ່ງ ({product.stock})
            </span>
          ) : product.stock > 0 ? (
            <span className="bg-orange-950/80 text-orange-300 border border-orange-600/60 text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-orange-400" />
              ເຫຼືອພຽງ {product.stock}
            </span>
          ) : (
            <span className="bg-red-950/80 text-red-300 border border-red-600/60 text-[10px] font-medium px-2 py-0.5 rounded">
              ສິນຄ້າໝົດ
            </span>
          )}
        </div>

        {/* Quick View Hover Overlay Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>ເບິ່ງຮູບໃຫຍ່ / ລາຍລະອຽດ</span>
          </button>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3
            className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
            onClick={() => onViewDetails(product)}
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Specs Micro-metadata (Unboxed per design guide) */}
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-300/80 mt-1.5">
            {product.specs?.weight && <span>{product.specs.weight}</span>}
            {product.specs?.tension && (
              <>
                <span aria-hidden="true">·</span>
                <span>{product.specs.tension}</span>
              </>
            )}
            {product.specs?.sizes && (
              <>
                <span aria-hidden="true">·</span>
                <span>Size: {product.specs.sizes.slice(0, 3).join(', ')}...</span>
              </>
            )}
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-emerald-900/60 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-base sm:text-lg font-black text-yellow-400 font-mono">
                {formatKip(product.price)}
              </span>
              {product.originalPrice && (
                <span className="block text-[11px] text-slate-400 line-through font-mono">
                  {formatKip(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Blue Button: View Details */}
            <button
              onClick={() => onViewDetails(product)}
              className="px-2.5 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>ລາຍລະອຽດ</span>
            </button>
          </div>

          {/* Yellow Action Button: Add to Cart */}
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`w-full py-2 px-3 rounded-xl font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[16px] font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow ${
              isOutOfStock
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-yellow-500/20'
            }`}
          >
            <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
            <span>{isOutOfStock ? 'ສິນຄ້າໝົດຊົ່ວຄາວ' : '+ ເພີ່ມໃສ່ກະຕ່າ'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
