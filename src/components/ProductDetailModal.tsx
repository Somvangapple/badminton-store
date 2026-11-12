import React, { useState } from 'react';
import { Product } from '../types';
import { formatKip } from '../data/initialData';
import {
  X,
  ZoomIn,
  ZoomOut,
  ShoppingCart,
  Zap,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedSize?: string) => void;
  onBuyNow: (product: Product, quantity: number, selectedSize?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.specs?.sizes ? product.specs.sizes[0] : ''
  );
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#062817] border-2 border-emerald-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Top Orange Header Bar */}
        <div className="bg-orange-600 px-5 py-3 flex items-center justify-between border-b-2 border-orange-700">
          <div className="flex items-center gap-2">
            <span className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-black">
              ລາຍລະອຽດສິນຄ້າ (Product Details)
            </span>
          </div>
          {/* Red Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all shadow"
            title="ປິດໜ້າຕ່າງ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left Column: Product Image with Zoom functionality */}
          <div className="flex flex-col gap-2">
            <div
              className={`relative rounded-xl overflow-hidden border border-emerald-800 bg-[#03150c] cursor-zoom-in ${
                isZoomed ? 'scale-110 shadow-2xl z-20 transition-transform duration-300' : ''
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-auto object-cover transition-all duration-300 ${
                  isZoomed ? 'scale-125 object-center' : 'hover:scale-105'
                }`}
              />

              {/* Zoom control toggle badge */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                className="absolute bottom-3 right-3 bg-black/80 hover:bg-orange-600 text-white p-2 rounded-lg backdrop-blur-sm transition-colors flex items-center gap-1.5 text-xs font-semibold shadow"
              >
                {isZoomed ? (
                  <>
                    <ZoomOut className="w-4 h-4 text-yellow-400" />
                    <span>ຍໍ້ຮູບພາບ</span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="w-4 h-4 text-yellow-400" />
                    <span>ກົດເພື່ອຂະຫຍາຍຮູບ (Zoom)</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-emerald-400/80 text-center">
              * ກົດເທິງຮູບເພື່ອຂະຫຍາຍເບິ່ງລາຍລະອຽດເນື້ອວັດສະດຸ ແລະ ຄຸນນະພາບສິນຄ້າ
            </p>
          </div>

          {/* Right Column: Specs, Price, Purchase Module */}
          <div className="flex flex-col gap-4 text-slate-100">
            <div>
              <span className="text-xs uppercase font-bold text-orange-400 tracking-wider">
                {product.brand} · {product.category.toUpperCase()}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 leading-snug">
                {product.name}
              </h2>
            </div>

            {/* Price Box */}
            <div className="p-3.5 rounded-xl bg-[#041a0f] border border-emerald-800/80 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">ລາຄາສິນຄ້າ:</span>
                <span className="text-2xl sm:text-3xl font-black text-yellow-400 font-mono">
                  {formatKip(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="ml-3 text-xs text-slate-400 line-through font-mono">
                    {formatKip(product.originalPrice)}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  ສະຕັອກ: {product.stock} ອັນ
                </span>
              </div>
            </div>

            {/* Product Description */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#052114] p-3 rounded-xl border border-emerald-900/60">
              <p>{product.description}</p>
            </div>

            {/* Specifications List */}
            {product.specs && (
              <div className="space-y-1.5 text-xs border-y border-emerald-800/80 py-3">
                <h4 className="font-bold text-orange-400">ຂໍ້ມູນສະເພາະ (Specifications):</h4>
                {product.specs.weight && (
                  <div className="flex justify-between py-1 border-b border-emerald-900/40">
                    <span className="text-slate-400">ນ້ຳໜັກ:</span>
                    <span className="font-semibold text-slate-200">{product.specs.weight}</span>
                  </div>
                )}
                {product.specs.tension && (
                  <div className="flex justify-between py-1 border-b border-emerald-900/40">
                    <span className="text-slate-400">ແຮງດຶງສາຍເອັນ:</span>
                    <span className="font-semibold text-slate-200">{product.specs.tension}</span>
                  </div>
                )}
                {product.specs.balance && (
                  <div className="flex justify-between py-1 border-b border-emerald-900/40">
                    <span className="text-slate-400">ຈຸດສົມດຸນ:</span>
                    <span className="font-semibold text-slate-200">{product.specs.balance}</span>
                  </div>
                )}
                {product.specs.material && (
                  <div className="flex justify-between py-1 border-b border-emerald-900/40">
                    <span className="text-slate-400">ວັດສະດຸ:</span>
                    <span className="font-semibold text-slate-200">{product.specs.material}</span>
                  </div>
                )}
                {product.specs.color && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">ໂທນສີ:</span>
                    <span className="font-semibold text-slate-200">{product.specs.color}</span>
                  </div>
                )}
              </div>
            )}

            {/* Sizes selector if apparel/shoes */}
            {product.specs?.sizes && product.specs.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ເລືອກຂະໜາດ (Select Size):
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.specs.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedSize === sz
                          ? 'bg-yellow-400 text-black ring-2 ring-black'
                          : 'bg-[#041a0f] text-slate-200 border border-emerald-800 hover:border-orange-500'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-slate-300">ຈຳນວນທີ່ຕ້ອງການ:</span>
              <div className="flex items-center gap-3 bg-[#041a0f] p-1 rounded-xl border border-emerald-800">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-white font-bold flex items-center justify-center disabled:opacity-40"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold font-mono text-sm">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-white font-bold flex items-center justify-center disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons using specified colors: Yellow and Blue */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Yellow Button: Add to Cart */}
              <button
                onClick={() => {
                  onAddToCart(product, quantity, selectedSize);
                  onClose();
                }}
                disabled={product.stock <= 0}
                className="py-3 px-4 bg-yellow-400 hover:bg-yellow-300 text-black font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
                <span>+ ເພີ່ມໃສ່ກະຕ່າ</span>
              </button>

              {/* Blue Button: Buy Now */}
              <button
                onClick={() => {
                  onBuyNow(product, quantity, selectedSize);
                  onClose();
                }}
                disabled={product.stock <= 0}
                className="py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                <Zap className="w-5 h-5" />
                <span>ຊື້ຕອນນີ້</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
