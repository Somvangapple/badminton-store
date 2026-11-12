import React from 'react';
import { ShoppingBag, ShieldCheck, Store, Flame, Award, Phone } from 'lucide-react';
import { formatKip } from '../data/initialData';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenPos: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenAdmin,
  onOpenPos,
  activeCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 shadow-lg">
      {/* Top micro announcement bar */}
      <div className="bg-[#041a0f] border-b border-emerald-900/60 px-4 py-1.5 text-xs text-emerald-200/90 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            ຮ້ານຂາຍອຸປະກອນກິລາແບັດມິນຕັນ ແທ້ 100% ມາດຕະຖານສາກົນ
          </span>
          <span className="hidden sm:inline text-emerald-600">|</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-300">
            <Phone className="w-3 h-3 text-orange-400" /> ສາຍດ່ວນ: 020 5566-7788
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 font-semibold">ຈັດສົ່ງທົ່ວປະເທດລາວ</span>
        </div>
      </div>

      {/* Main Orange Bar (ແຖບຕ່າງໆແມ່ນສີສົ້ມ Orange) */}
      <div className="bg-orange-600 text-black px-4 sm:px-8 py-3 flex items-center justify-between border-b-2 border-orange-700 shadow-md">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectCategory('all')}>
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-black text-xl shadow-md border-2 border-yellow-400">
            BP
          </div>
          <div>
            <h1 className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[20px] font-black text-black leading-tight tracking-tight drop-shadow-sm">
              ຮ້ານແບັດມິນຕັນ ໂປຣ (BADMINTON PRO)
            </h1>
            <p className="text-[11px] font-bold text-black/80 tracking-wide uppercase">
              LAOS OFFICIAL SPORTS STORE & POS
            </p>
          </div>
        </div>

        {/* Main Menu Links with Required Font: Phetsarath OT, size 18, Bold, Black text */}
        <nav className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => onSelectCategory('all')}
            className={`font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-black hover:text-black hover:underline transition-all px-2 py-1 rounded ${
              activeCategory === 'all' ? 'bg-orange-700/20 underline decoration-2' : ''
            }`}
          >
            ໜ້າຫຼັກ (Home)
          </button>

          <button
            onClick={() => onSelectCategory('racket')}
            className={`font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-black hover:text-black hover:underline transition-all px-2 py-1 rounded ${
              activeCategory === 'racket' ? 'bg-orange-700/20 underline decoration-2' : ''
            }`}
          >
            ໄມ້ຕີແບັດ (Rackets)
          </button>

          <button
            onClick={() => onSelectCategory('shoes')}
            className={`font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-black hover:text-black hover:underline transition-all px-2 py-1 rounded ${
              activeCategory === 'shoes' ? 'bg-orange-700/20 underline decoration-2' : ''
            }`}
          >
            ເກີບກິລາ (Shoes)
          </button>

          {/* Yellow Action Button for Quick POS */}
          <button
            onClick={onOpenPos}
            className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
            title="ເປີດໜ້າຈໍຂາຍໜ້າຮ້ານ POS"
          >
            <Store className="w-4 h-4 text-black stroke-[2.5]" />
            <span>ລະບົບ POS ໜ້າຮ້ານ</span>
          </button>

          {/* Blue Button for Admin Panel */}
          <button
            onClick={onOpenAdmin}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
            title="ເຂົ້າສູ່ລະບົບຈັດການ Admin"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Admin (ຈັດການ)</span>
          </button>
        </nav>

        {/* Right Action: Shopping Cart Button & Mobile Controls */}
        <div className="flex items-center gap-2.5">
          {/* Mobile POS & Admin buttons */}
          <button
            onClick={onOpenPos}
            className="lg:hidden p-2 bg-yellow-400 text-black rounded-lg text-xs font-bold shadow flex items-center gap-1"
            title="POS"
          >
            <Store className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAdmin}
            className="lg:hidden p-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1"
            title="Admin"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Cart Button (with Red badge counter) */}
          <button
            onClick={onOpenCart}
            className="relative px-3 sm:px-4 py-2 bg-black hover:bg-slate-900 text-white rounded-xl shadow-md flex items-center gap-2.5 transition-transform active:scale-95 border border-yellow-400/40"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-yellow-400" />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-red-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-[10px] text-slate-400 leading-none">ກະຕ່າສິນຄ້າ</span>
              <span className="text-xs font-bold text-yellow-400 font-mono">
                {cartTotal > 0 ? formatKip(cartTotal) : '0 ₭'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
