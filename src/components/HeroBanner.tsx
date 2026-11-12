import React from 'react';
import { ShoppingCart, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
  onOpenPos: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow, onOpenPos }) => {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-emerald-800/60 bg-[#072c1c] shadow-2xl mb-8">
      {/* Background Graphic overlay */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
        <img
          src="/src/assets/images/hero_badminton_action_1793235158126.jpg"
          alt="Badminton Action Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041a0f] via-[#041a0f]/80 to-transparent" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl flex flex-col items-start gap-4">
        {/* Highlight badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-600 text-black text-xs font-bold rounded-md uppercase tracking-wider shadow">
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span>ຄຸນນະພາບສາກົນ 100% · ຮັບປະກັນແທ້ຈາກສູນ</span>
        </div>

        {/* Hero Title */}
        <h2 className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
          ອຸປະກອນກິລາແບັດມິນຕັນ <br />
          <span className="text-orange-400">ລະດັບມືອາຊີບ ຄົບວົງຈອນ</span>
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl">
          ສູນລວມໄມ້ຕີແບັດ, ເກີບຄອດພື້ນຢາງດິບ, ຊຸດກິລາ Dry-Tech, ໝາກແບັດຂົນຫ່ານ ແລະ ຜ້າພັນດ້າມຄຸນນະພາບສູງ ພ້ອມບໍລິການຂຶ້ນເອັນມາດຕະຖານສາກົນ.
        </p>

        {/* Action Buttons using specified colors: Red, Blue, Yellow */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Blue Button: Primary Action */}
          <button
            onClick={onShopNow}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95 hover:shadow-blue-500/30"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>ເລືອກຊື້ສິນຄ້າອອນໄລນ໌</span>
          </button>

          {/* Yellow Button: POS Action */}
          <button
            onClick={onOpenPos}
            className="px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
          >
            <Zap className="w-5 h-5 text-black" />
            <span>ເປີດລະບົບຂາຍ POS</span>
          </button>
        </div>

        {/* Feature bullets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-emerald-800/80 w-full text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span>ສົ່ງດ່ວນພາຍໃນ 24 ຊົ່ວໂມງ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>ຈ່າຍຜ່ານ BCEL One / COD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span>ປັກໝຸດ GPS ຈັດສົ່ງຮອດທີ່</span>
          </div>
        </div>
      </div>
    </section>
  );
};
