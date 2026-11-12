import React, { useState } from 'react';
import { Product, Order, OrderStatus } from '../types';
import { formatKip, CATEGORIES } from '../data/initialData';
import {
  X,
  Lock,
  Package,
  ShoppingCart,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  Ban,
  Upload,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onAddProduct: (prod: Product) => void;
  onUpdateProduct: (prod: Product) => void;
  onDeleteProduct: (prodId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}) => {
  if (!isOpen) return null;

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  // Order filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [selectedSlipOrder, setSelectedSlipOrder] = useState<Order | null>(null);

  // Product Management Modal/Form State
  const [isEditingProduct, setIsEditingProduct] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<'racket' | 'shoes' | 'apparel' | 'shuttlecock' | 'grip' | 'accessory'>('racket');
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodStock, setProdStock] = useState<number>(10);
  const [prodBrand, setProdBrand] = useState('Yonex');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState<string>('/src/assets/images/product_badminton_racket_1793235158346.jpg');
  const [prodWeight, setProdWeight] = useState('4U (83g)');
  const [prodTension, setProdTension] = useState('24-30 lbs');

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('ຊື່ຜູ້ນຳໃຊ້ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ! (ທົດລອງ: admin / admin)');
    }
  };

  // Image Upload for Admin directly into system (converts to DataURL)
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProdImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Edit Product Modal
  const openEditModal = (p: Product) => {
    setEditingId(p.id);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdPrice(p.price);
    setProdStock(p.stock);
    setProdBrand(p.brand);
    setProdDescription(p.description);
    setProdImage(p.image);
    setProdWeight(p.specs?.weight || '');
    setProdTension(p.specs?.tension || '');
    setIsEditingProduct(true);
  };

  // Open Add Product Modal
  const openAddModal = () => {
    setEditingId(null);
    setProdName('');
    setProdCategory('racket');
    setProdPrice(500000);
    setProdStock(10);
    setProdBrand('Yonex');
    setProdDescription('ອຸປະກອນກິລາແບັດມິນຕັນຄຸນນະພາບສູງ ມາດຕະຖານສາກົນ.');
    setProdImage('/src/assets/images/product_badminton_racket_1793235158346.jpg');
    setProdWeight('4U (83g)');
    setProdTension('24-30 lbs');
    setIsEditingProduct(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Edit existing
      onUpdateProduct({
        id: editingId,
        name: prodName,
        category: prodCategory,
        price: Number(prodPrice),
        stock: Number(prodStock),
        brand: prodBrand,
        description: prodDescription,
        image: prodImage,
        specs: {
          weight: prodWeight,
          tension: prodTension,
        },
      });
    } else {
      // Add new
      onAddProduct({
        id: `prod-${Date.now()}`,
        name: prodName,
        category: prodCategory,
        price: Number(prodPrice),
        stock: Number(prodStock),
        brand: prodBrand,
        description: prodDescription,
        image: prodImage,
        specs: {
          weight: prodWeight,
          tension: prodTension,
        },
      });
    }
    setIsEditingProduct(false);
  };

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    const matchesSearch =
      ord.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.phone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6">
      <div className="relative w-full max-w-6xl bg-[#062817] border-2 border-emerald-700 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Header Bar in Orange (ແຖບຕ່າງໆແມ່ນສີສົ້ມ Orange) */}
        <div className="bg-orange-600 px-5 py-3.5 flex items-center justify-between border-b-2 border-orange-700">
          <div className="flex items-center gap-3">
            <h2 className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-black">
              ລະບົບຈັດການຫຼັງບ້ານ (Admin Dashboard & Store Backend)
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

        {/* Not Authenticated: Login Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-600/20 border border-orange-500 flex items-center justify-center mb-4 text-orange-400">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-2xl font-bold text-white mb-1">
              ເຂົ້າສູ່ລະບົບຜູ້ດູແລຮ້ານ (Admin Login)
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ (ຄ່າເລີ່ມຕົ້ນ: admin / admin)
            </p>

            {loginError && (
              <div className="w-full p-2.5 mb-4 rounded-lg bg-red-950/80 border border-red-600 text-red-200 text-xs">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ຊື່ຜູ້ນຳໃຊ້ (Username):
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#041a0f] border border-emerald-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ລະຫັດຜ່ານ (Password):
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••"
                  className="w-full bg-[#041a0f] border border-emerald-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Blue Button: Login */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-xl shadow-lg transition-transform active:scale-95 mt-2"
              >
                ເຂົ້າສູ່ລະບົບ (Log In)
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated: Dashboard with 2 Core Tabs */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Orange Tabs Bar for Navigation */}
            <div className="bg-orange-600/90 px-4 py-2 border-b border-orange-700 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-black px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                    activeTab === 'orders'
                      ? 'bg-yellow-400 text-black shadow ring-2 ring-black/40'
                      : 'hover:bg-orange-500 text-black'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                  <span>1. ຈັດການອໍເດີ້ສັ່ງຊື້ ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-black px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                    activeTab === 'products'
                      ? 'bg-yellow-400 text-black shadow ring-2 ring-black/40'
                      : 'hover:bg-orange-500 text-black'
                  }`}
                >
                  <Package className="w-4 h-4 stroke-[2.5]" />
                  <span>2. ຈັດການສິນຄ້າ & ສະຕັອກ ({products.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded shadow transition-colors"
                >
                  ອອກຈາກລະບົບ
                </button>
              </div>
            </div>

            {/* Tab 1: Orders Management */}
            {activeTab === 'orders' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#041a0f] p-3 rounded-xl border border-emerald-800">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-slate-300">ກັ່ນຕອງສະຖານະ:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-[#072c1c] text-white border border-emerald-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-orange-500"
                    >
                      <option value="all">ທັງໝົດ</option>
                      <option value="preparing">ກຳລັງກຽມເຄື່ອງ</option>
                      <option value="delivering">ກຳລັງຈັດສົ່ງ</option>
                      <option value="completed">ຈັດສົ່ງສຳເລັດແລ້ວ</option>
                      <option value="cancelled">ຍົກເລີກ</option>
                    </select>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="ຄົ້ນຫາເລກທີອໍເດີ້, ຊື່, ເບີໂທ..."
                      className="w-full bg-[#072c1c] border border-emerald-700 rounded-lg pl-9 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Orders List Table */}
                <div className="rounded-xl border border-emerald-800 overflow-hidden shadow">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-200">
                      <thead className="bg-[#03150c] text-emerald-300 border-b border-emerald-800 font-bold">
                        <tr>
                          <th className="p-3">ເລກທີ & ວັນທີ</th>
                          <th className="p-3">ຂໍ້ມູນລູກຄ້າ & ເບີໂທ</th>
                          <th className="p-3">ທີ່ຢູ່ຈັດສົ່ງ & GPS Pin</th>
                          <th className="p-3">ລາຍການ & ຍອດລວມ</th>
                          <th className="p-3">ການຊຳລະ & ສະລິບ</th>
                          <th className="p-3">ປ່ຽນສະຖານະອໍເດີ້</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-900/50 bg-[#041a0f]">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-slate-400">
                              ບໍ່ພົບລາຍການສັ່ງຊື້ທີ່ກົງກັບເງື່ອນໄຂ
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((ord) => {
                            return (
                              <tr key={ord.id} className="hover:bg-emerald-950/40">
                                <td className="p-3 font-mono">
                                  <div className="font-bold text-white text-sm">{ord.id}</div>
                                  <div className="text-[10px] text-slate-400">{ord.createdAt}</div>
                                  <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    ord.orderType === 'pos' ? 'bg-purple-900 text-purple-200' : 'bg-emerald-900 text-emerald-200'
                                  }`}>
                                    {ord.orderType === 'pos' ? 'POS ໜ້າຮ້ານ' : 'Online E-com'}
                                  </span>
                                </td>

                                <td className="p-3">
                                  <div className="font-semibold text-white">{ord.customerName}</div>
                                  <div className="text-orange-400 font-mono text-[11px]">{ord.phone}</div>
                                  {ord.notes && (
                                    <div className="text-[10px] text-slate-400 italic mt-0.5 max-w-[180px] truncate" title={ord.notes}>
                                      ໝາຍເຫດ: {ord.notes}
                                    </div>
                                  )}
                                </td>

                                <td className="p-3 max-w-[200px]">
                                  <div className="text-slate-300 line-clamp-2 text-[11px]">
                                    {ord.address}
                                  </div>
                                  <a
                                    href={`https://www.openstreetmap.org/?mlat=${ord.coordinates.lat}&mlon=${ord.coordinates.lng}#map=16/${ord.coordinates.lat}/${ord.coordinates.lng}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 underline mt-1"
                                  >
                                    <span>ເບິ່ງແຜນທີ່ GPS</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </td>

                                <td className="p-3">
                                  <div className="font-mono font-bold text-yellow-400 text-sm">
                                    {formatKip(ord.total)}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {ord.items.map((i) => `${i.product.name} x${i.quantity}`).join(', ')}
                                  </div>
                                </td>

                                <td className="p-3">
                                  {ord.paymentMethod === 'bank_qr' ? (
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[11px] font-bold text-orange-400">Bank QR</span>
                                      {ord.slipImage ? (
                                        <button
                                          onClick={() => setSelectedSlipOrder(ord)}
                                          className="px-2 py-0.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded text-[10px] font-semibold flex items-center gap-1 w-fit"
                                        >
                                          <Eye className="w-3 h-3" />
                                          ກວດສະລິບ
                                        </button>
                                      ) : (
                                        <span className="text-[10px] text-slate-400">ບໍ່ມີສະລິບ</span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-[11px] font-bold text-emerald-400">
                                      COD ເກັບເງິນປາຍທາງ
                                    </span>
                                  )}
                                </td>

                                {/* Status Toggle Dropdown / Action Buttons as required:
                                    ກຳລັງກຽມເຄື່ອງ -> ກຳລັງຈັດສົ່ງ -> ຈັດສົ່ງສຳເລັດແລ້ວ */}
                                <td className="p-3">
                                  <div className="flex flex-col gap-1.5">
                                    <select
                                      value={ord.status}
                                      onChange={(e) =>
                                        onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)
                                      }
                                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                        ord.status === 'preparing'
                                          ? 'bg-yellow-950 text-yellow-300 border-yellow-600'
                                          : ord.status === 'delivering'
                                          ? 'bg-blue-950 text-blue-300 border-blue-600'
                                          : ord.status === 'completed'
                                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                                          : 'bg-red-950 text-red-300 border-red-600'
                                      }`}
                                    >
                                      <option value="preparing">ກຳລັງກຽມເຄື່ອງ</option>
                                      <option value="delivering">ກຳລັງຈັດສົ່ງ</option>
                                      <option value="completed">ຈັດສົ່ງສຳເລັດແລ້ວ</option>
                                      <option value="cancelled">ຍົກເລີກ</option>
                                    </select>

                                    {/* Quick Next State Advance Button */}
                                    {ord.status === 'preparing' && (
                                      <button
                                        onClick={() => onUpdateOrderStatus(ord.id, 'delivering')}
                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded flex items-center justify-center gap-1 shadow"
                                      >
                                        <Truck className="w-3 h-3" />
                                        <span>ເລີ່ມຈັດສົ່ງ</span>
                                      </button>
                                    )}
                                    {ord.status === 'delivering' && (
                                      <button
                                        onClick={() => onUpdateOrderStatus(ord.id, 'completed')}
                                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded flex items-center justify-center gap-1 shadow"
                                      >
                                        <CheckCircle className="w-3 h-3" />
                                        <span>ຈັດສົ່ງສຳເລັດ</span>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Products & Inventory Management */}
            {activeTab === 'products' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-xl font-bold text-white">
                      ລາຍການສິນຄ້າໃນຮ້ານ ({products.length} ລາຍການ)
                    </h3>
                    <p className="text-xs text-slate-400">
                      ທ່ານສາມາດເພີ່ມ, ແກ້ໄຂລາຄາ, ປັບປ່ຽນຈຳນວນສະຕັອກ ແລະ ອັບໂຫຼດຮູບພາບໂດຍກົງ
                    </p>
                  </div>

                  {/* Blue Button: Add Product */}
                  <button
                    onClick={openAddModal}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ ເພີ່ມສິນຄ້າໃໝ່</span>
                  </button>
                </div>

                {/* Products Table */}
                <div className="rounded-xl border border-emerald-800 overflow-hidden shadow">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-200">
                      <thead className="bg-[#03150c] text-emerald-300 border-b border-emerald-800 font-bold">
                        <tr>
                          <th className="p-3">ຮູບພາບ</th>
                          <th className="p-3">ຊື່ສິນຄ້າ & ແບຣນ</th>
                          <th className="p-3">ໝວດໝູ່</th>
                          <th className="p-3">ລາຄາ (Kip)</th>
                          <th className="p-3">ຈຳນວນສະຕັອກ</th>
                          <th className="p-3 text-center">ຈັດການ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-900/50 bg-[#041a0f]">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-emerald-950/40">
                            <td className="p-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-14 h-14 rounded-lg object-cover bg-black/40 border border-emerald-800 shadow-sm"
                              />
                            </td>
                            <td className="p-3 max-w-[260px]">
                              <div className="font-bold text-white text-sm">{p.name}</div>
                              <div className="text-[11px] text-orange-400 font-semibold">{p.brand}</div>
                            </td>
                            <td className="p-3">
                              <span className="capitalize font-mono px-2 py-0.5 bg-emerald-950 border border-emerald-800 rounded text-emerald-300">
                                {p.category}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-bold text-yellow-400 text-sm">
                              {formatKip(p.price)}
                            </td>
                            <td className="p-3">
                              <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                                p.stock > 10 ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                              }`}>
                                {p.stock} ອັນ
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center justify-center gap-2">
                                {/* Yellow Button: Edit */}
                                <button
                                  onClick={() => openEditModal(p)}
                                  className="p-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg shadow transition-colors"
                                  title="ແກ້ໄຂສິນຄ້າ"
                                >
                                  <Edit3 className="w-4 h-4 stroke-[2.5]" />
                                </button>

                                {/* Red Button: Delete */}
                                <button
                                  onClick={() => {
                                    if (confirm(`ທ່ານຕ້ອງການລົບສິນຄ້າ "${p.name}" ແທ້ບໍ່?`)) {
                                      onDeleteProduct(p.id);
                                    }
                                  }}
                                  className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow transition-colors"
                                  title="ລົບສິນຄ້າ"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal: View Uploaded Bank Transfer Slip */}
        {selectedSlipOrder && (
          <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#062817] border-2 border-emerald-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
              <div className="bg-orange-600 px-4 py-2.5 flex items-center justify-between">
                <span className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-black">
                  ສະລິບໂອນເງິນ: {selectedSlipOrder.id}
                </span>
                <button
                  onClick={() => setSelectedSlipOrder(null)}
                  className="w-7 h-7 bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 flex flex-col items-center gap-3">
                <img
                  src={selectedSlipOrder.slipImage}
                  alt="Bank Slip"
                  className="max-h-[60vh] object-contain rounded-xl border border-emerald-800 shadow"
                />
                <div className="text-xs text-center text-slate-300">
                  <p>ຍອດເງິນທີ່ຕ້ອງຊຳລະ: <strong className="text-yellow-400 font-mono">{formatKip(selectedSlipOrder.total)}</strong></p>
                  <p>ລູກຄ້າ: {selectedSlipOrder.customerName} ({selectedSlipOrder.phone})</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add / Edit Product Form */}
        {isEditingProduct && (
          <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-[#062817] border-2 border-emerald-700 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl my-auto">
              <div className="bg-orange-600 px-5 py-3 flex items-center justify-between border-b-2 border-orange-700">
                <span className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-black">
                  {editingId ? 'ແກ້ໄຂຂໍ້ມູນສິນຄ້າ (Edit Product)' : 'ເພີ່ມສິນຄ້າໃໝ່ (Add New Product)'}
                </span>
                <button
                  onClick={() => setIsEditingProduct(false)}
                  className="w-7 h-7 bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-5 space-y-3.5 text-xs text-slate-200">
                <div>
                  <label className="block font-semibold mb-1">ຊື່ສິນຄ້າ (Product Name) *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="ເຊັ່ນ: ໄມ້ຕີແບັດ Yonex Astrox 88D Pro"
                    className="w-full bg-[#041a0f] border border-emerald-800 rounded-lg p-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">ໝວດໝູ່ (Category) *</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as any)}
                      className="w-full bg-[#041a0f] border border-emerald-800 rounded-lg p-2 text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="racket">ໄມ້ຕີແບັດ (Racket)</option>
                      <option value="shoes">ເກີບກິລາ (Shoes)</option>
                      <option value="apparel">ຊຸດກິລາ (Apparel)</option>
                      <option value="shuttlecock">ໝາກແບັດ (Shuttlecock)</option>
                      <option value="grip">ຜ້າພັນດ້າມ (Grip)</option>
                      <option value="accessory">ອຸປະກອນເສີມ (Accessory)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">ແບຣນສິນຄ້າ (Brand)</label>
                    <input
                      type="text"
                      value={prodBrand}
                      onChange={(e) => setProdBrand(e.target.value)}
                      placeholder="Yonex, Victor, Li-Ning..."
                      className="w-full bg-[#041a0f] border border-emerald-800 rounded-lg p-2 text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">ລາຄາຂາຍ (Price in Kip) *</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      step={5000}
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full bg-[#041a0f] border border-emerald-800 rounded-lg p-2 text-white font-mono text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">ຈຳນວນໃນສະຕັອກ (Stock Count) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      className="w-full bg-[#041a0f] border border-emerald-800 rounded-lg p-2 text-white font-mono text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Image Upload directly by Admin */}
                <div>
                  <label className="block font-semibold mb-1">
                    ຮູບພາບສິນຄ້າ (Direct Image Upload) *
                  </label>
                  <div className="flex items-center gap-3 bg-[#041a0f] p-2.5 rounded-xl border border-emerald-800">
                    <img
                      src={prodImage}
                      alt="Preview"
                      className="w-16 h-16 rounded-lg object-cover border border-emerald-700 bg-black shrink-0"
                    />
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow">
                        <Upload className="w-3.5 h-3.5" />
                        <span>ອັບໂຫຼດຮູບຈາກເຄື່ອງ...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-slate-400 mt-1">
                        ຮອງຮັບໄຟລ໌ JPG, PNG, WEBP ຮູບພາບຈະສະແດງທັນທີ
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">ນ້ຳໜັກ / ຂະໜາດ (Weight / Size)</label>
                    <input
                      type="text"
                      value={prodWeight}
                      onChange={(e) => setProdWeight(e.target.value)}
                      placeholder="4U (83g) / Size 41"
                      className="w-full bg-[#041a0f] border border-emerald-800 rounded-lg p-2 text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">ແຮງດຶງສາຍ / ສີ (Tension / Color)</label>
                    <input
                      type="text"
                      value={prodTension}
                      onChange={(e) => setProdTension(e.target.value)}
                      placeholder="24-30 lbs"
                      className="w-full bg-[#041a0f] border border-emerald-800 rounded-lg p-2 text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">ລາຍລະອຽດສິນຄ້າ (Description)</label>
                  <textarea
                    rows={2}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="w-full bg-[#041a0f] border border-emerald-800 rounded-lg p-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Action Buttons: Red and Blue */}
                <div className="flex justify-end gap-2.5 pt-2 border-t border-emerald-900">
                  <button
                    type="button"
                    onClick={() => setIsEditingProduct(false)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-xl shadow"
                  >
                    ຍົກເລີກ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-xl shadow-lg"
                  >
                    ບັນທຶກສິນຄ້າ (Save)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
