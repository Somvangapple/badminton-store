export interface Product {
  id: string;
  name: string;
  category: 'racket' | 'shoes' | 'apparel' | 'shuttlecock' | 'grip' | 'accessory';
  price: number; // in Lao Kip (₭)
  originalPrice?: number;
  stock: number;
  image: string;
  brand: string;
  description: string;
  specs?: {
    weight?: string;
    tension?: string;
    balance?: string;
    sizes?: string[];
    color?: string;
    material?: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export type OrderStatus = 'preparing' | 'delivering' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  locationName?: string;
  paymentMethod: 'cod' | 'bank_qr';
  slipImage?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  orderType: 'online' | 'pos';
  notes?: string;
}
