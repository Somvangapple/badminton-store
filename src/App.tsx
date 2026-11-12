/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminModal } from './components/AdminModal';
import { PosModal } from './components/PosModal';
import { CheckCircle2, Award, Truck, ShieldCheck, MapPin, Phone, Clock } from 'lucide-react';

export default function App() {
  // Persistence for products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bp_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Persistence for orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bp_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  // Persistence for cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bp_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // UI state
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isPosOpen, setIsPosOpen] = useState<boolean>(false);
  const [lastSuccessOrder, setLastSuccessOrder] = useState<Order | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('bp_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bp_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bp_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.selectedSize === selectedSize
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.selectedSize === selectedSize
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity, selectedSize }];
    });
    showToast(`ເພີ່ມ "${product.name}" ໃສ່ກະຕ່າແລ້ວ!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, selectedSize);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.selectedSize === selectedSize ? { ...i, quantity } : i
      )
    );
  };

  const handleRemoveItem = (productId: string, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.selectedSize === selectedSize))
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleBuyNow = (product: Product, quantity = 1, selectedSize?: string) => {
    handleAddToCart(product, quantity, selectedSize);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order submission
  const handleSubmitOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setLastSuccessOrder(order);
    showToast(`ສັ່ງຊື້ສຳເລັດ! ເລກທີອໍເດີ້: ${order.id}`);
  };

  // POS Sale completion
  const handleCompletePosSale = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    showToast(`ບັນທຶກການຂາຍໜ້າຮ້ານ ${order.id} ຮຽບຮ້ອຍແລ້ວ`);
  };

  // Admin Product modifications
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`ເພີ່ມສິນຄ້າ "${newProd.name}" ສຳເລັດ!`);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    showToast(`ອັບເດດສິນຄ້າ "${updatedProd.name}" ຮຽບຮ້ອຍແລ້ວ!`);
  };

  const handleDeleteProduct = (prodId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== prodId));
    showToast('ລົບສິນຄ້າອອກຈາກລະບົບແລ້ວ!');
  };

  // Admin Order Status Update
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`ອັບເດດສະຖານະອໍເດີ້ ${orderId} ແລ້ວ!`);
  };

  // Filtered Products for Catalog
  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#052114] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-black/90 border-2 border-orange-500 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Orange Bar Navbar with Required Font: Phetsarath OT, 18, Bold, Black */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPos={() => setIsPosOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchTerm('');
        }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Showcase Banner */}
        <HeroBanner
          onShopNow={() => {
            const el = document.getElementById('catalog-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenPos={() => setIsPosOpen(true)}
        />

        {/* Catalog Section */}
        <div id="catalog-section" className="pt-2">
          {/* Orange Filter Tabs Bar */}
          <CategoryFilterBar
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setSearchTerm('');
            }}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            totalProductsCount={filteredProducts.length}
          />

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-[#072c1c] rounded-2xl border border-emerald-800 p-12 text-center text-slate-400">
              <p className="text-base font-bold text-white mb-2">ບໍ່ພົບສິນຄ້າທີ່ກົງກັບການຄົ້ນຫາ</p>
              <p className="text-xs text-slate-400 mb-4">
                ລອງປ່ຽນຄຳຄົ້ນຫາ ຫຼື ເລືອກໝວດໝູ່ສິນຄ້າອື່ນ
              </p>
              {/* Yellow Button */}
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-lg shadow"
              >
                ສະແດງສິນຄ້າທັງໝົດ
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onViewDetails={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>

        {/* Trust & Service Highlights */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-emerald-800/80 pt-8">
          <div className="p-4 rounded-xl bg-[#072c1c] border border-emerald-800/80 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-orange-600 text-white shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ສິນຄ້າແທ້ 100% ມີປະກັນສູນ</h4>
              <p className="text-xs text-emerald-300/80 mt-1">
                ຮັບປະກັນໄມ້ແບັດ, ເກີບ, ເອັນແທ້ ມາດຕະຖານແຂ່ງຂັນລະດັບສາກົນ.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#072c1c] border border-emerald-800/80 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-blue-600 text-white shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ຈັດສົ່ງດ່ວນພ້ອມປັກໝຸດ GPS</h4>
              <p className="text-xs text-emerald-300/80 mt-1">
                ດຶງ GPS ສົ່ງຮອດໜ້າບ້ານ, ໂຮງຮຽນ ຫຼື ເດີ່ນແບັດມິນຕັນໃນລາວ.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#072c1c] border border-emerald-800/80 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-yellow-400 text-black shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ຊຳລະເງິນສະດວກ 2 ຊ່ອງທາງ</h4>
              <p className="text-xs text-emerald-300/80 mt-1">
                ເລືອກໂອນຜ່ານ BCEL OnePay ຫຼື ເກັບເງິນປາຍທາງ (Cash on Delivery).
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer in Deep Dark Green with Orange bar touch */}
      <footer className="mt-12 border-t-2 border-orange-600 bg-[#03150c] text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-2">
            <h3 className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-lg font-bold text-white">
              ຮ້ານຂາຍອຸປະກອນກິລາແບັດມິນຕັນ (BADMINTON PRO LAOS)
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              ລະບົບການຂາຍສິນຄ້າແບບ POS ແລະ E-commerce ຮ້ານຂາຍອຸປະກອນກິລາແບັດມິນຕັນ ຄົບວົງຈອນ ຕອບສະໜອງນັກກິລາມືອາຊີບ ແລະ ນັກກິລາທົ່ວໄປໃນປະເທດລາວ.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-orange-400 mb-2">ຕິດຕໍ່ & ທີ່ຢູ່ຮ້ານ</h4>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>020 5566-7788 / 020 9988-2233</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>ເປີດທຸກມື້: 08:30 - 21:00 ໂມງ</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-orange-400 mb-2">ລະບົບຫຼັງບ້ານ</h4>
            <div className="space-y-2">
              {/* Blue Button */}
              <button
                onClick={() => setIsAdminOpen(true)}
                className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
              >
                <span>ເຂົ້າສູ່ລະບົບ Admin</span>
              </button>
              {/* Yellow Button */}
              <button
                onClick={() => setIsPosOpen(true)}
                className="w-full px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
              >
                <span>ເປີດໜ້າຈໍຂາຍ POS</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-950 py-3 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} Badminton Pro Laos POS & E-Commerce Store. All rights reserved.
        </div>
      </footer>

      {/* Modals & Drawers */}
      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        items={cart}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* 4. Order Success / Printable Invoice Modal */}
      <OrderSuccessModal
        order={lastSuccessOrder}
        onClose={() => setLastSuccessOrder(null)}
      />

      {/* 5. Admin Dashboard Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      {/* 6. POS Cashier Terminal Modal */}
      <PosModal
        isOpen={isPosOpen}
        onClose={() => setIsPosOpen(false)}
        products={products}
        onCompletePosSale={handleCompletePosSale}
      />
    </div>
  );
}
