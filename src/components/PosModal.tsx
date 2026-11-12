import React, { useState } from 'react';
import { Product, Order, CartItem } from '../types';
import { formatKip, CATEGORIES } from '../data/initialData';
import {
  X,
  Store,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle2,
  Banknote,
  RotateCcw,
  UserCheck
} from 'lucide-react';

interface PosModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onCompletePosSale: (order: Order) => void;
}

export const PosModal: React.FC<PosModalProps> = ({
  isOpen,
  onClose,
  products,
  onCompletePosSale,
}) => {
  if (!isOpen) return null;

  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [customerName, setCustomerName] = useState<string>('ລູກຄ້າໜ້າຮ້ານ (Walk-in)');
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Filter products for POS
  const filteredProducts = products.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToPosCart = (product: Product) => {
    setPosCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setPosCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const removeFromCart = (productId: string) => {
    setPosCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => {
    setPosCart([]);
    setCashReceived(0);
  };

  const subtotal = posCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal;
  const changeAmount = cashReceived > total ? cashReceived - total : 0;

  // Finish Sale
  const handleCheckout = () => {
    if (posCart.length === 0) return;

    const newOrder: Order = {
      id: `POS-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleString('lo-LA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: customerName.trim() || 'ລູກຄ້າໜ້າຮ້ານ (Walk-in)',
      phone: '020-หน้าร้าน',
      address: 'ຊື້ຢູ່ໜ້າຮ້ານ Badminton Pro Store Vientiane',
      coordinates: { lat: 17.9757, lng: 102.6133 },
      paymentMethod: 'cod',
      items: posCart,
      subtotal,
      deliveryFee: 0,
      total,
      status: 'completed',
      orderType: 'pos',
    };

    onCompletePosSale(newOrder);
    setReceiptOrder(newOrder);
    setPosCart([]);
  };

  const quickCashAmounts = [100000, 200000, 500000, 1000000, 2000000];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-7xl bg-[#062817] border-2 border-emerald-700 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col h-[94vh]">
        {/* Top Header Bar in Orange (ແຖບຕ່າງໆແມ່ນສີສົ້ມ Orange) */}
        <div className="bg-orange-600 px-5 py-3 flex items-center justify-between border-b-2 border-orange-700">
          <div className="flex items-center gap-2.5">
            <Store className="w-6 h-6 text-black stroke-[2.5]" />
            <div>
              <h2 className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-black leading-tight">
                ລະບົບຂາຍໜ້າຮ້ານ POS (Point of Sale Cashier Terminal)
              </h2>
              <p className="text-[11px] font-bold text-black/80">
                Badminton Pro Store · ໂໝດເກັບເງິນດ່ວນໜ້າຮ້ານ
              </p>
            </div>
          </div>
          {/* Red Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all shadow"
            title="ປິດໜ້າຈໍ POS"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* POS Grid: Left is Products Catalog, Right is Cashier Ticket */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left: Product Selection (7 cols) */}
          <div className="lg:col-span-7 flex flex-col border-r border-emerald-800 bg-[#052114] overflow-hidden p-3 sm:p-4 gap-3">
            {/* Category Tabs (Orange bars) */}
            <div className="bg-orange-600 p-1 rounded-xl shadow-sm overflow-x-auto no-scrollbar flex gap-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[15px] font-bold text-black whitespace-nowrap px-3 py-1 rounded-lg transition-all ${
                    activeCategory === c.id
                      ? 'bg-yellow-400 text-black shadow font-black'
                      : 'hover:bg-orange-500 text-black'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ຄົ້ນຫາຊື່ສິນຄ້າ / ສະແກນບາໂຄດ..."
                className="w-full bg-[#03150c] border border-emerald-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Product Cards for Fast Tap */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 pr-1">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => addToPosCart(prod)}
                  className="bg-[#072c1c] border border-emerald-800 hover:border-yellow-400 rounded-xl p-2.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] shadow active:scale-95 group"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full aspect-[4/3] object-cover rounded-lg bg-black/40 mb-2"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-yellow-400 line-clamp-1">
                      {prod.name}
                    </h4>
                    <span className="text-[10px] text-emerald-400">{prod.brand}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-emerald-900">
                    <span className="font-mono font-bold text-yellow-400 text-xs">
                      {formatKip(prod.price)}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-xs">
                      +
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Cashier Order Ticket (5 cols) */}
          <div className="lg:col-span-5 flex flex-col bg-[#041a0f] p-4 justify-between overflow-hidden">
            {/* Customer Name & Clear Cart */}
            <div className="space-y-2 pb-3 border-b border-emerald-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  ລູກຄ້າ:
                </span>
                {/* Red Button: Clear Cart */}
                {posCart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    ລ້າງລາຍການ
                  </button>
                )}
              </div>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="ຊື່ລູກຄ້າ..."
                className="w-full bg-[#072c1c] border border-emerald-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Ticket Items List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {posCart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                  <Store className="w-12 h-12 text-emerald-900 mb-2" />
                  <p className="text-xs">ຍັງບໍ່ມີລາຍການສິນຄ້າໃນໃບບິນ</p>
                  <p className="text-[10px] text-slate-500">ກົດເລືອກສິນຄ້າດ້ານຊ້າຍເພື່ອເພີ່ມໃສ່ບິນ</p>
                </div>
              ) : (
                posCart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between bg-[#062817] p-2.5 rounded-lg border border-emerald-900 text-xs"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="font-semibold text-white truncate">{item.product.name}</div>
                      <div className="text-[11px] font-mono text-yellow-400">
                        {formatKip(item.product.price)}
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-black/60 rounded border border-emerald-800">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-white"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold font-mono text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      {/* Red Button: Remove */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations & Cash Received / Change Return */}
            <div className="pt-3 border-t border-emerald-800 space-y-2.5">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">ຍອດລວມທີ່ຕ້ອງຈ່າຍ:</span>
                <span className="text-2xl font-black text-yellow-400 font-mono">
                  {formatKip(total)}
                </span>
              </div>

              {/* Cash Input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  ຮັບເງິນສົດຈາກລູກຄ້າ (Cash Received):
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={cashReceived === 0 ? '' : cashReceived}
                    onChange={(e) => setCashReceived(Number(e.target.value))}
                    placeholder="0"
                    className="flex-1 bg-[#03150c] border border-emerald-800 rounded-lg px-3 py-1.5 font-mono text-base font-bold text-yellow-300 focus:outline-none focus:border-orange-500"
                  />
                  {/* Yellow Button: Exact Amount */}
                  <button
                    onClick={() => setCashReceived(total)}
                    className="px-2.5 py-1 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold rounded-lg shadow"
                  >
                    ພໍດີ (Exact)
                  </button>
                </div>

                {/* Quick denomination pills */}
                <div className="flex gap-1.5 flex-wrap mt-1.5">
                  {quickCashAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setCashReceived(amt)}
                      className="px-2 py-0.5 bg-emerald-950 hover:bg-orange-600 hover:text-white border border-emerald-800 rounded text-[10px] font-mono text-emerald-300 transition-colors"
                    >
                      {amt.toLocaleString()}₭
                    </button>
                  ))}
                </div>
              </div>

              {/* Change Return (ເງິນທອນ) */}
              <div className="p-2.5 rounded-xl bg-[#03150c] border border-emerald-800 flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">ເງິນທອນໃຫ້ລູກຄ້າ (Change):</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  {formatKip(changeAmount)}
                </span>
              </div>

              {/* Blue Checkout Button */}
              <button
                disabled={posCart.length === 0}
                onClick={handleCheckout}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                <Banknote className="w-5 h-5" />
                <span>ບັນທຶກການຂາຍ & ພິມໃບບິນ</span>
              </button>
            </div>
          </div>
        </div>

        {/* POS Receipt Modal on Finish */}
        {receiptOrder && (
          <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-5 shadow-2xl font-mono text-xs">
              <div className="text-center pb-3 border-b border-dashed border-slate-300">
                <h3 className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-base font-bold text-slate-900">
                  BADMINTON PRO LAOS
                </h3>
                <p className="text-[10px] text-slate-500">ໃບບິນຮັບເງິນ / RECEIPT</p>
                <p className="text-[10px] text-slate-500">{receiptOrder.id}</p>
                <p className="text-[10px] text-slate-500">{receiptOrder.createdAt}</p>
              </div>

              <div className="py-2.5 space-y-1.5 border-b border-dashed border-slate-300">
                {receiptOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate pr-2">
                      {it.product.name} x{it.quantity}
                    </span>
                    <span className="font-bold shrink-0">{formatKip(it.product.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="py-2.5 space-y-1 border-b border-dashed border-slate-300">
                <div className="flex justify-between font-bold text-sm">
                  <span>ຍອດລວມ:</span>
                  <span>{formatKip(receiptOrder.total)}</span>
                </div>
                {cashReceived > 0 && (
                  <>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>ຮັບເງິນສົດ:</span>
                      <span>{formatKip(cashReceived)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-bold text-[11px]">
                      <span>ເງິນທອນ:</span>
                      <span>{formatKip(changeAmount)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="text-center pt-3 text-[10px] text-slate-500">
                <p>ຂອບໃຈທີ່ໃຊ້ບໍລິການ ຮ້ານແບັດມິນຕັນ ໂປຣ</p>
                <p>Welcome back again!</p>
              </div>

              <div className="flex gap-2 pt-4">
                {/* Blue Print */}
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>ພິມໃບບິນ</span>
                </button>
                {/* Yellow Close */}
                <button
                  onClick={() => setReceiptOrder(null)}
                  className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-bold"
                >
                  ປິດ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
