export type Category = 
  | 'Bal & Arı Ürünleri'
  | 'Peynir & Süt Ürünleri'
  | 'Zeytin & Zeytinyağı'
  | 'Tereyağı & Şarküteri'
  | 'Kuruyemiş & Kuru Meyve'
  | 'Reçel & Pekmez & Sirke'
  | 'Salça & Sos & Baharat'
  | 'Çay & Yöresel İçecekler'
  | 'Pestil & Köme & Tatlı';

export type ProductUnit = 'kg' | 'gr' | 'lt' | 'ml' | 'adet' | 'teneke' | 'kavanoz';

export type RegionalOrigin = 
  | 'Rize / Karadeniz'
  | 'Kars / Doğu Anadolu'
  | 'Ayvalık / Ege'
  | 'Malatya / Doğu Anadolu'
  | 'Gaziantep / Güneydoğu'
  | 'Trabzon / Karadeniz'
  | 'Hatay / Akdeniz'
  | 'Bursa / Marmara'
  | 'Afyon / Ege'
  | 'Erzurum / Doğu Anadolu';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: Category;
  origin: RegionalOrigin;
  unit: ProductUnit;
  unitAmount: number; // e.g. 500 for 500gr, 1 for 1kg
  buyPrice: number; // TL
  sellPrice: number; // TL
  stockQuantity: number;
  minStockAlert: number;
  expiryDate: string; // YYYY-MM-DD
  supplierName: string;
  isOrganic: boolean;
  isGeographicalIndication: boolean; // Coğrafi İşaretli Ürün
  image: string;
  description: string;
  createdAt: string;
}

export type OrderStatus = 'Yeni' | 'Hazırlanıyor' | 'Kargoda' | 'Teslim Edildi' | 'İptal';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: ProductUnit;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  taxAmount: number; // KDV %10 / %20
  totalAmount: number;
  status: OrderStatus;
  cargoCompany?: 'Yurtiçi Kargo' | 'Aras Kargo' | 'Trendyol Express' | 'MNG Kargo' | 'Sürat Kargo' | 'PTT Kargo';
  trackingNumber?: string;
  paymentMethod: 'Kredi Kartı' | 'Havale/EFT' | 'Kapıda Ödeme';
  notes?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  isVip: boolean;
  lastOrderDate: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  region: RegionalOrigin;
  city: string;
  suppliedCategories: Category[];
  rating: number; // 1-5
  isCertifiedOrganic: boolean;
}

export interface StoreStats {
  totalRevenue: number;
  totalOrdersCount: number;
  avgOrderValue: number;
  lowStockCount: number;
  geographicalCertifiedPercent: number;
}

export interface StoreSettings {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  taxOffice: string;
  taxNumber: string;
  defaultShippingFee: number;
  freeShippingThreshold: number;
  defaultVatRate: number;
  bankIban: string;
  bankName: string;
  bankAccountHolder: string;
}

