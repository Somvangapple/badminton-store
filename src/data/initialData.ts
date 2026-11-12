import { Product, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'ໄມ້ຕີແບັດ Aurora X-Pro 9000 Hybrid',
    category: 'racket',
    price: 1850000,
    originalPrice: 2100000,
    stock: 14,
    image: '/src/assets/images/product_badminton_racket_1793235158346.jpg',
    brand: 'Aurora Badminton',
    description: 'ໄມ້ຕີແບັດລຸ້ນທ໊ອບຄາບອນໄຟເບີ ນ້ຳໜັກເບົາ ແຕ່ພະລັງຕົບໜັກແໜ້ນ ຕອບສະໜອງໄວ ເໝາະສຳລັບສາຍບຸກ ແລະ ຄວບຄຸມລູກຢ່າງແມ່ຍຳ.',
    specs: {
      weight: '4U (83g ± 2g)',
      tension: '24 - 30 lbs',
      balance: 'Head Heavy (298mm)',
      material: 'High Modulus Ultra Graphite + Nano Carbon',
      color: 'ຂຽວມໍລະກົດ / ດຳ / ສີສົ້ມໄຟ'
    }
  },
  {
    id: 'prod-2',
    name: 'ເກີບກິລາແບັດມິນຕັນ Volt-Air Pro Court Non-Marking',
    category: 'shoes',
    price: 1290000,
    originalPrice: 1450000,
    stock: 22,
    image: '/src/assets/images/product_badminton_shoes_1793235158856.jpg',
    brand: 'Volt Sport',
    description: 'ເກີບສຳລັບສະໜາມແບັດມິນຕັນໃນຮົ່ມ ພື້ນຢາງດິບ Gum Rubber ຍຶດເກາະດີເລີດ ບໍ່ເປັນຮອຍເທິງຄອດ ລະບົບຊັບແຮງກະແທກ Power Cushion ປ້ອງກັນຂໍ້ຕີນ.',
    specs: {
      sizes: ['39', '40', '41', '42', '43', '44'],
      weight: '295g (Size 41)',
      material: 'Breathable Mesh + TPU Reinforcement + Gum Sole',
      color: 'ຂຽວສະໜາມ / ສົ້ມສະຫວ່າງ'
    }
  },
  {
    id: 'prod-3',
    name: 'ໝາກແບັດ Aeroflight Pro Feather (ຫຼອດ 12 ລູກ)',
    category: 'shuttlecock',
    price: 320000,
    originalPrice: 350000,
    stock: 58,
    image: '/src/assets/images/product_shuttlecocks_1793235159179.jpg',
    brand: 'Aeroflight',
    description: 'ໝາກແບັດຂົນຫ່ານແທ້ເກຣດແຂ່ງຂັນມາດຕະຖານສາກົນ (Tournament Grade) ວິຖີບິນນິ້ງ ສະຖຽນ ທົນທານ ຫົວກ໊ອກທຳມະຊາດ 2 ຊັ້ນ.',
    specs: {
      weight: '5.0g ຕໍ່ລູກ (Speed 77)',
      material: '100% Selected Goose Feathers + Natural Composite Cork',
      color: 'ຂາວບໍລິສຸດ'
    }
  },
  {
    id: 'prod-4',
    name: 'ຊຸດກິລາແບັດມິນຕັນ Titans 24 Pro Tournament Jersey',
    category: 'apparel',
    price: 280000,
    originalPrice: 320000,
    stock: 35,
    image: '/src/assets/images/product_badminton_jersey_1793235159039.jpg',
    brand: 'Titans Sportswear',
    description: 'ເສື້ອກິລາແບັດມິນຕັນ ຜ້າ Dry-Fit Quick Dry ລະບາຍເຫື່ອ ແລະ ຄວາມຮ້ອນໄວ ນຸ່ງສະບາຍ ຢືດຢຸ່ນ 4 ທິດທາງ ເສີມຄວາມໝັ້ນໃຈທຸກຊັອດ.',
    specs: {
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      material: '100% Micro Polyester Dry-Tech',
      color: 'ຂຽວເຂັ້ມ / ລາຍກຣາບຟິກສີສົ້ມ'
    }
  },
  {
    id: 'prod-5',
    name: 'ຜ້າພັນດ້າມ Volt Grip Anti-Slip High-Performance (ແພັກ 3 ກໍ້)',
    category: 'grip',
    price: 85000,
    originalPrice: 105000,
    stock: 80,
    image: '/src/assets/images/product_badminton_grip_1793235173784.jpg',
    brand: 'Volt Grip',
    description: 'ຜ້າພັນດ້າມແບັດມິນຕັນຄຸນນະພາບສູງ ຜິວໜຽວນຸ້ມ ຊຶມຊັບເຫື່ອໄດ້ດີເລີດ ບໍ່ມື່ນມື ຄວາມໜາ 0.6mm ຈັບກະຊັບຕິດມືທຸກການເຄື່ອນໄຫວ.',
    specs: {
      material: 'Polyurethane (PU) with sweat-absorbing pores',
      weight: '0.6mm thickness x 25mm width x 1100mm length',
      color: 'ສີສົ້ມ, ສີເຫຼືອງນີອອນ, ສີຂຽວເຂັ້ມ'
    }
  },
  {
    id: 'prod-6',
    name: 'ໄມ້ຕີແບັດ Yonex Nanoflare 1000Z Speed Pro',
    category: 'racket',
    price: 2450000,
    originalPrice: 2690000,
    stock: 8,
    image: '/src/assets/images/product_badminton_racket_1793235158346.jpg',
    brand: 'Yonex Japan',
    description: 'ໄມ້ສາຍຄວາມໄວລະດັບໂລກ Sonic Flare System ຂອບເຟຣມບາງຕັດອາກາດໄວທີ່ສຸດ ເພີ່ມສະປີດລູກໄດ້ເຖິງຂີດສຸດ.',
    specs: {
      weight: '4U (83g)',
      tension: '20 - 28 lbs',
      balance: 'Head Light - Fast Swing',
      material: 'Torayca M40X + Ultra PE FIBER',
      color: 'Lightning Yellow & Emerald Deep Green'
    }
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'BP-2026-1082',
    createdAt: '2026-10-28 14:35',
    customerName: 'ທ່ານ ສົມພອນ ແກ້ວມະນີ',
    phone: '020 55667788',
    address: 'ບ້ານ ໂພນສະຫວ່າງ, ເມືອງ ຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ (ໃກ້ເດີ່ນແບັດມິນຕັນ ວຽງຈັນ)',
    coordinates: {
      lat: 17.9757,
      lng: 102.6133
    },
    locationName: 'ນະຄອນຫຼວງວຽງຈັນ (Vientiane Capital)',
    paymentMethod: 'bank_qr',
    slipImage: '/src/assets/images/product_shuttlecocks_1793235159179.jpg',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 2
      }
    ],
    subtotal: 2490000,
    deliveryFee: 0,
    total: 2490000,
    status: 'preparing',
    orderType: 'online',
    notes: 'ຂໍໃບຮັບປະກັນໄມ້ແບັດມິນຕັນມານໍາແດ່ເດີ້ ຂອບໃຈ'
  },
  {
    id: 'BP-2026-1081',
    createdAt: '2026-10-28 11:20',
    customerName: 'ນາງ ວິໄລພອນ ໄຊຍະສານ',
    phone: '020 99882233',
    address: 'ບ້ານ ດົງໂດກ, ເມືອງ ໄຊທານີ, ນະຄອນຫຼວງວຽງຈັນ (ໜ້າ ມຊ)',
    coordinates: {
      lat: 18.0382,
      lng: 102.6368
    },
    locationName: 'ດົງໂດກ (Dongdok, Vientiane)',
    paymentMethod: 'cod',
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        selectedSize: '41'
      },
      {
        product: INITIAL_PRODUCTS[4],
        quantity: 2
      }
    ],
    subtotal: 1460000,
    deliveryFee: 20000,
    total: 1480000,
    status: 'delivering',
    orderType: 'online',
    notes: 'ໂທກ່ອນສົ່ງ 30 ນາທີ'
  },
  {
    id: 'POS-2026-0945',
    createdAt: '2026-10-28 09:15',
    customerName: 'ລູກຄ້າໜ້າຮ້ານ (Walk-in)',
    phone: '020 77112233',
    address: 'ຊື້ຢູ່ໜ້າຮ້ານ Badminton Pro Store Vientiane',
    coordinates: {
      lat: 17.9658,
      lng: 102.6074
    },
    locationName: 'ໜ້າຮ້ານ Badminton Pro Store',
    paymentMethod: 'cod',
    items: [
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 3
      }
    ],
    subtotal: 960000,
    deliveryFee: 0,
    total: 960000,
    status: 'completed',
    orderType: 'pos'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'ສິນຄ້າທັງໝົດ' },
  { id: 'racket', label: 'ໄມ້ຕີແບັດ' },
  { id: 'shoes', label: 'ເກີບກິລາ' },
  { id: 'apparel', label: 'ຊຸດກິລາ' },
  { id: 'shuttlecock', label: 'ໝາກແບັດ' },
  { id: 'grip', label: 'ຜ້າພັນດ້າມ & ອຸປະກອນ' }
] as const;

export function formatKip(amount: number): string {
  return new Intl.NumberFormat('lo-LA').format(amount) + ' ₭';
}
