import React from 'react';
import { CATEGORIES } from '../data/initialData';
import { Search } from 'lucide-react';

interface CategoryFilterBarProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  totalProductsCount: number;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  activeCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  totalProductsCount,
}) => {
  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Category Tabs Strip in Orange (ແຖບຕ່າງໆແມ່ນສີສົ້ມ Orange) */}
      <div className="bg-orange-600 rounded-xl p-1.5 shadow-md border-b-2 border-orange-700">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-black whitespace-nowrap px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-yellow-400 text-black shadow-md scale-102 ring-2 ring-black/40'
                    : 'hover:bg-orange-500/80 text-black'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-bar with Search & Product Count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#072c1c] p-3 rounded-xl border border-emerald-800/80">
        <div className="flex items-center gap-2 text-xs text-emerald-200">
          <span className="font-semibold text-orange-400 font-mono text-sm">
            {totalProductsCount}
          </span>
          <span>ລາຍການສິນຄ້າພ້ອມສົ່ງ</span>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ຄົ້ນຫາຊື່ສິນຄ້າ ຫຼື ປະເພດ..."
            className="w-full bg-[#041a0f] border border-emerald-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-emerald-500/70 focus:outline-none focus:border-orange-500"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
