import { useState, useEffect } from 'react';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_SUPPLIERS 
} from './data/mockData';
import type { Product, Order, Customer, Supplier, OrderStatus, StoreStats, StoreSettings } from './types';

import { Sidebar } from './components/Sidebar';
import type { ActiveTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Dashboard } from './components/Dashboard';
import { Products } from './components/Products';
import { Orders } from './components/Orders';
import { Customers } from './components/Customers';
import { Suppliers } from './components/Suppliers';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { ProductModal } from './components/ProductModal';
import { CustomerModal } from './components/CustomerModal';
import { SupplierModal } from './components/SupplierModal';
import { OrderModal } from './components/OrderModal';
import { OrderDetailModal } from './components/OrderDetailModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { CheckCircle2 } from 'lucide-react';

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'Hasbahçe Yöresel Gıda ve Organik Ürünler Ltd. Şti.',
  storePhone: '0850 308 45 53',
  storeEmail: 'siparis@hasbahceyoresel.com',
  storeAddress: 'Atatürk Cad. Rize Karadeniz Bölgesi / Türkiye',
  taxOffice: 'Rize Vergi Dairesi',
  taxNumber: '0458921049281',
  defaultShippingFee: 50,
  freeShippingThreshold: 500,
  defaultVatRate: 10,
  bankIban: 'TR92 0006 2000 0000 1234 5678 90',
  bankName: 'Ziraat Bankası Rize Şubesi',
  bankAccountHolder: 'Hasbahçe Yöresel Gıda A.Ş.'
};

export function App() {
  // LocalStorage Persistence - Default to clean state if not present (demo data removed)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('hasbahce_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('hasbahce_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('hasbahce_customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('hasbahce_suppliers');
    return saved ? JSON.parse(saved) : [];
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('hasbahce_store_settings');
    return saved ? JSON.parse(saved) : DEFAULT_STORE_SETTINGS;
  });

  // UI States
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mobile Menu Drawer State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsAppPhone, setWhatsAppPhone] = useState('');
  const [whatsAppText, setWhatsAppText] = useState('');

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('hasbahce_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('hasbahce_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('hasbahce_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('hasbahce_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('hasbahce_store_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Product CRUD
  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productData } as Product : p));
      showToast(`"${productData.name}" başarıyla güncellendi.`);
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        sku: productData.sku || `HB-${Math.floor(1000 + Math.random() * 9000)}`,
        name: productData.name || 'Yeni Yöresel Ürün',
        category: productData.category || 'Bal & Arı Ürünleri',
        origin: productData.origin || 'Rize / Karadeniz',
        unit: productData.unit || 'kg',
        unitAmount: productData.unitAmount || 1,
        buyPrice: productData.buyPrice || 100,
        sellPrice: productData.sellPrice || 160,
        stockQuantity: productData.stockQuantity || 10,
        minStockAlert: productData.minStockAlert || 5,
        expiryDate: productData.expiryDate || '2027-12-31',
        supplierName: productData.supplierName || 'Hasbahçe Kooperatifi',
        isOrganic: productData.isOrganic ?? true,
        isGeographicalIndication: productData.isGeographicalIndication ?? true,
        image: productData.image || 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80',
        description: productData.description || '',
        createdAt: new Date().toISOString().slice(0, 10)
      };
      setProducts(prev => [newProduct, ...prev]);
      showToast(`Yeni ürün "${newProduct.name}" kataloğa eklendi.`);
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    if (confirm(`"${prod?.name}" ürününü silmek istediğinize emin misiniz?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast(`Ürün sistemden kaldırıldı.`);
    }
  };

  const handleUpdateStock = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stockQuantity + delta);
        return { ...p, stockQuantity: newStock };
      }
      return p;
    }));
    showToast(`Stok seviyesi güncellendi.`);
  };

  // Customer CRUD
  const handleSaveCustomer = (customerData: Partial<Customer>) => {
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...customerData } as Customer : c));
      showToast(`Müşteri "${customerData.name}" güncellendi.`);
    } else {
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: customerData.name || 'Yeni Müşteri',
        phone: customerData.phone || '',
        email: customerData.email || '',
        city: customerData.city || 'İstanbul',
        address: customerData.address || '',
        totalOrders: 0,
        totalSpent: 0,
        isVip: customerData.isVip || false,
        lastOrderDate: new Date().toISOString().slice(0, 10)
      };
      setCustomers(prev => [newCustomer, ...prev]);
      showToast(`Müşteri "${newCustomer.name}" kaydoldu.`);
    }
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (id: string) => {
    const cust = customers.find(c => c.id === id);
    if (confirm(`"${cust?.name}" adlı müşteriyi silmek istediğinize emin misiniz?`)) {
      setCustomers(prev => prev.filter(c => c.id !== id));
      showToast(`Müşteri kaydı silindi.`);
    }
  };

  const handleToggleVip = (id: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const updatedVip = !c.isVip;
        showToast(`${c.name} VIP statüsü ${updatedVip ? 'aktifleştirildi' : 'kaldırıldı'}.`);
        return { ...c, isVip: updatedVip };
      }
      return c;
    }));
  };

  // Supplier CRUD
  const handleSaveSupplier = (supplierData: Partial<Supplier>) => {
    if (editingSupplier) {
      setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? { ...s, ...supplierData } as Supplier : s));
      showToast(`Tedarikçi "${supplierData.name}" güncellendi.`);
    } else {
      const newSupplier: Supplier = {
        id: `sup-${Date.now()}`,
        name: supplierData.name || 'Yeni Tedarikçi',
        contactPerson: supplierData.contactPerson || 'Yetkili',
        phone: supplierData.phone || '',
        email: supplierData.email || '',
        region: supplierData.region || 'Rize / Karadeniz',
        city: supplierData.city || 'Rize',
        suppliedCategories: supplierData.suppliedCategories || ['Bal & Arı Ürünleri'],
        rating: supplierData.rating || 5.0,
        isCertifiedOrganic: supplierData.isCertifiedOrganic ?? true
      };
      setSuppliers(prev => [newSupplier, ...prev]);
      showToast(`Yeni tedarikçi "${newSupplier.name}" eklendi.`);
    }
    setEditingSupplier(null);
  };

  const handleDeleteSupplier = (id: string) => {
    const sup = suppliers.find(s => s.id === id);
    if (confirm(`"${sup?.name}" tedarikçisini silmek istediğinize emin misiniz?`)) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
      showToast(`Tedarikçi silindi.`);
    }
  };

  // Order CRUD
  const handleSaveOrder = (orderData: Partial<Order>) => {
    if (editingOrder) {
      setOrders(prev => prev.map(o => o.id === editingOrder.id ? { ...o, ...orderData } as Order : o));
      showToast(`Sipariş #${orderData.orderNumber} güncellendi.`);
    } else {
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: orderData.orderNumber || `HB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: orderData.customerName || 'Müşteri',
        customerPhone: orderData.customerPhone || '',
        customerEmail: orderData.customerEmail || '',
        deliveryAddress: orderData.deliveryAddress || '',
        city: orderData.city || 'İstanbul',
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        shippingFee: orderData.shippingFee || 0,
        taxAmount: orderData.taxAmount || 0,
        totalAmount: orderData.totalAmount || 0,
        status: orderData.status || 'Yeni',
        cargoCompany: orderData.cargoCompany || 'Yurtiçi Kargo',
        trackingNumber: orderData.trackingNumber || '',
        paymentMethod: orderData.paymentMethod || 'Kredi Kartı',
        notes: orderData.notes || '',
        createdAt: new Date().toISOString().slice(0, 10)
      };
      setOrders(prev => [newOrder, ...prev]);
      showToast(`Yeni sipariş #${newOrder.orderNumber} oluşturuldu.`);
    }
    setEditingOrder(null);
  };

  const handleDeleteOrder = (id: string) => {
    const ord = orders.find(o => o.id === id);
    if (confirm(`Sipariş #${ord?.orderNumber} kaydını silmek istediğinize emin misiniz?`)) {
      setOrders(prev => prev.filter(o => o.id !== id));
      showToast(`Sipariş sistemden silindi.`);
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, cargoCompany?: any, trackingNo?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          cargoCompany: cargoCompany || o.cargoCompany,
          trackingNumber: trackingNo !== undefined ? trackingNo : o.trackingNumber
        };
      }
      return o;
    }));
    showToast(`Sipariş durumu "${status}" olarak güncellendi.`);
  };

  // Store Settings
  const handleSaveStoreSettings = (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    showToast('Mağaza profil ve sistem ayarları başarıyla kaydedildi.');
  };

  // WhatsApp Launcher Helper
  const handleOpenWhatsApp = (phone?: string, text?: string) => {
    if (phone) setWhatsAppPhone(phone);
    if (text) setWhatsAppText(text);
    setIsWhatsAppOpen(true);
  };

  // Load Demo Data
  const handleLoadDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setSuppliers(INITIAL_SUPPLIERS);
    setStoreSettings(DEFAULT_STORE_SETTINGS);
    showToast('Örnek demo verileri yüklendi.');
  };

  // Clear All Data
  const handleClearAllData = () => {
    setProducts([]);
    setOrders([]);
    setCustomers([]);
    setSuppliers([]);
    localStorage.removeItem('hasbahce_products');
    localStorage.removeItem('hasbahce_orders');
    localStorage.removeItem('hasbahce_customers');
    localStorage.removeItem('hasbahce_suppliers');
    showToast('Tüm veriler temizlendi.');
  };

  const handleImportData = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.products) setProducts(parsed.products);
      if (parsed.orders) setOrders(parsed.orders);
      if (parsed.customers) setCustomers(parsed.customers);
      if (parsed.suppliers) setSuppliers(parsed.suppliers);
      if (parsed.storeSettings) setStoreSettings(parsed.storeSettings);
      showToast('Yedek verileri başarıyla yüklendi.');
    } catch (e) {
      alert('Geçersiz JSON formatı!');
    }
  };

  // Calculated Stats
  const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'İptal' ? o.totalAmount : 0), 0);
  const lowStockCount = products.filter(p => p.stockQuantity <= p.minStockAlert).length;
  const newOrdersCount = orders.filter(o => o.status === 'Yeni').length;
  const geoCertifiedCount = products.filter(p => p.isGeographicalIndication).length;
  const geoPercent = products.length ? Math.round((geoCertifiedCount / products.length) * 100) : 0;

  const storeStats: StoreStats = {
    totalRevenue,
    totalOrdersCount: orders.length,
    avgOrderValue: orders.length ? Math.round(totalRevenue / orders.length) : 0,
    lowStockCount,
    geographicalCertifiedPercent: geoPercent
  };

  return (
    <div className={`min-h-screen font-sans bg-slate-950 text-slate-100 flex flex-col lg:flex-row ${darkMode ? 'dark' : ''}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 lg:bottom-6 right-4 lg:right-6 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation (Desktop Fixed & Mobile Slide-Over Drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lowStockCount={lowStockCount}
        newOrdersCount={newOrdersCount}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAddProduct={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
          onOpenWhatsApp={() => handleOpenWhatsApp()}
          setActiveTab={setActiveTab}
          lowStockCount={lowStockCount}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 p-3 sm:p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              products={products}
              orders={orders}
              stats={storeStats}
              onViewOrder={(order) => setSelectedOrder(order)}
              onRestockProduct={(prod) => { setEditingProduct(prod); setIsProductModalOpen(true); }}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'products' && (
            <Products
              products={products}
              onAddProduct={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
              onEditProduct={(prod) => { setEditingProduct(prod); setIsProductModalOpen(true); }}
              onDeleteProduct={handleDeleteProduct}
              onUpdateStock={handleUpdateStock}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'orders' && (
            <Orders
              orders={orders}
              onAddOrder={() => { setEditingOrder(null); setIsOrderModalOpen(true); }}
              onEditOrder={(order) => { setEditingOrder(order); setIsOrderModalOpen(true); }}
              onDeleteOrder={handleDeleteOrder}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onViewOrderDetails={(order) => setSelectedOrder(order)}
              onSendWhatsApp={handleOpenWhatsApp}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'customers' && (
            <Customers
              customers={customers}
              onAddCustomer={() => { setEditingCustomer(null); setIsCustomerModalOpen(true); }}
              onEditCustomer={(cust) => { setEditingCustomer(cust); setIsCustomerModalOpen(true); }}
              onDeleteCustomer={handleDeleteCustomer}
              onToggleVip={handleToggleVip}
              onSendWhatsApp={handleOpenWhatsApp}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'suppliers' && (
            <Suppliers
              suppliers={suppliers}
              onAddSupplier={() => { setEditingSupplier(null); setIsSupplierModalOpen(true); }}
              onEditSupplier={(sup) => { setEditingSupplier(sup); setIsSupplierModalOpen(true); }}
              onDeleteSupplier={handleDeleteSupplier}
            />
          )}

          {activeTab === 'reports' && (
            <Reports
              orders={orders}
              products={products}
              stats={storeStats}
            />
          )}

          {activeTab === 'whatsapp' && (
            <div className="max-w-2xl mx-auto pt-4 sm:pt-6">
              <div className="bg-slate-900 border border-slate-800 p-5 sm:p-8 rounded-2xl text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <span className="text-2xl sm:text-3xl">💬</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-100">WhatsApp Müşteri İletişim Entegrasyonu</h2>
                <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
                  Hasbahçe Yöresel müşterilerine kargo takip bildirimleri, sipariş güncellemeleri ve özel kampanya duyurularını tek tıkla iletin.
                </p>
                <button
                  onClick={() => setIsWhatsAppOpen(true)}
                  className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-green-950 transition-all"
                >
                  WhatsApp Mesaj Oluşturucuyu Aç
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <Settings
              products={products}
              orders={orders}
              customers={customers}
              suppliers={suppliers}
              storeSettings={storeSettings}
              onSaveStoreSettings={handleSaveStoreSettings}
              onLoadDemoData={handleLoadDemoData}
              onClearAllData={handleClearAllData}
              onImportData={handleImportData}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Hidden on Desktop) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lowStockCount={lowStockCount}
        newOrdersCount={newOrdersCount}
      />

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
        initialCustomer={editingCustomer}
      />

      <SupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        onSave={handleSaveSupplier}
        initialSupplier={editingSupplier}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSave={handleSaveOrder}
        initialOrder={editingOrder}
        products={products}
        customers={customers}
      />

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateOrderStatus}
        onSendWhatsApp={handleOpenWhatsApp}
      />

      <WhatsAppWidget
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        defaultPhone={whatsAppPhone}
        defaultText={whatsAppText}
      />
    </div>
  );
}

export default App;
