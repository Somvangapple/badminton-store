import React from 'react';
import { CartItem } from '../types';
import { formatKip } from '../data/initialData';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  onRemoveItem: (productId: string, selectedSize?: string) => void;
  onClearCart: () => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 500000 || items.length === 0 ? 0 : 20000;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="relative w-full max-w-md bg-[#062817] border-l-2 border-emerald-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Top Header Bar in Orange (ແຖບຕ່າງໆແມ່ນສີສົ້ມ Orange) */}
        <div className="bg-orange-600 px-5 py-4 flex items-center justify-between border-b-2 border-orange-700">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-black stroke-[2.5]" />
            <h2 className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-black">
              ກະຕ່າສິນຄ້າ ({items.reduce((acc, i) => acc + i.quantity, 0)} ລາຍການ)
            </h2>
          </div>
          {/* Red Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all shadow"
            title="ປິດ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ShoppingBag className="w-16 h-16 text-emerald-800/80 mb-3" />
              <p className="text-base font-semibold text-slate-200">ກະຕ່າຂອງທ່ານຍັງວ່າງເປົ່າ</p>
              <p className="text-xs text-slate-400 mt-1">
                ເລືອກອຸປະກອນກິລາແບັດມິນຕັນທີ່ທ່ານມັກ ແລ້ວກົດເພີ່ມໃສ່ກະຕ່າໄດ້ເລີຍ!
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-4 py-2 bg-yellow-400 text-black text-xs font-bold rounded-lg shadow"
              >
                ເລືອກເບິ່ງສິນຄ້າ
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedSize || 'default'}-${idx}`}
                className="bg-[#041a0f] border border-emerald-800/80 rounded-xl p-3 flex gap-3 items-center"
              >
                {/* Thumbnail */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover bg-black/40 border border-emerald-900 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                  {item.selectedSize && (
                    <span className="text-[11px] text-orange-400">Size: {item.selectedSize}</span>
                  )}
                  <div className="text-xs font-bold text-yellow-400 font-mono mt-0.5">
                    {formatKip(item.product.price)}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center bg-[#072c1c] rounded-lg border border-emerald-800">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity - 1, item.selectedSize)
                        }
                        className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedSize)
                        }
                        disabled={item.quantity >= item.product.stock}
                        className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono ml-auto">
                      = {formatKip(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>

                {/* Red Button: Delete Item */}
                <button
                  onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                  className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-colors"
                  title="ລົບອອກຈາກກະຕ່າ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-4 bg-[#041a0f] border-t-2 border-emerald-800 space-y-3">
            {/* Calculation summary */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>ລາຄາລວມສິນຄ້າ:</span>
                <span className="font-mono font-bold text-white">{formatKip(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>ຄ່າຈັດສົ່ງ (Delivery):</span>
                <span className="font-mono font-bold text-emerald-400">
                  {deliveryFee === 0 ? 'ຟຣີ (Free ຈັດສົ່ງ)' : formatKip(deliveryFee)}
                </span>
              </div>
              {deliveryFee === 0 && subtotal >= 500000 && (
                <p className="text-[10px] text-emerald-400">✓ ຍອດສັ່ງຊື້ເກີນ 500,000 ₭ ຟຣີຄ່າຈັດສົ່ງທົ່ວປະເທດ</p>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-emerald-900">
                <span className="text-white">ຍອດລວມທັງໝົດ:</span>
                <span className="text-yellow-400 font-mono text-lg">{formatKip(total)}</span>
              </div>
            </div>

            {/* Red Button: Clear Cart */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={onClearCart}
                className="px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                title="ລ້າງສິນຄ້າທັງໝົດໃນກະຕ່າ"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ລ້າງກະຕ່າ</span>
              </button>

              {/* Blue Button: Checkout */}
              <button
                onClick={onProceedCheckout}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <span>ດຳເນີນການສັ່ງຊື້</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
