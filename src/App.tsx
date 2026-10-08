import { useState, useEffect } from 'react';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_SUPPLIERS 
} from './data/mockData';
import type { Product, Order, Customer, Supplier, OrderStatus, StoreStats } from './types';

import { Sidebar } from './components/Sidebar';
import type { ActiveTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Products } from './components/Products';
import { Orders } from './components/Orders';
import { Customers } from './components/Customers';
import { Suppliers } from './components/Suppliers';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { ProductModal } from './components/ProductModal';
import { OrderDetailModal } from './components/OrderDetailModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  // LocalStorage Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('hasbahce_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('hasbahce_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('hasbahce_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('hasbahce_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  // UI States
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Product CRUD
  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      // Edit
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productData } as Product : p));
      showToast(`"${productData.name}" başarıyla güncellendi.`);
    } else {
      // Create
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

  // Order Status Update
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

  // WhatsApp Launcher Helper
  const handleOpenWhatsApp = (phone?: string, text?: string) => {
    if (phone) setWhatsAppPhone(phone);
    if (text) setWhatsAppText(text);
    setIsWhatsAppOpen(true);
  };

  // Reset Demo Data
  const handleResetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setSuppliers(INITIAL_SUPPLIERS);
    localStorage.removeItem('hasbahce_products');
    localStorage.removeItem('hasbahce_orders');
    localStorage.removeItem('hasbahce_customers');
    localStorage.removeItem('hasbahce_suppliers');
    showToast('Demo verileri sıfırlandı.');
  };

  const handleImportData = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.products) setProducts(parsed.products);
      if (parsed.orders) setOrders(parsed.orders);
      if (parsed.customers) setCustomers(parsed.customers);
      if (parsed.suppliers) setSuppliers(parsed.suppliers);
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
    <div className={`min-h-screen font-sans bg-slate-950 text-slate-100 flex ${darkMode ? 'dark' : ''}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lowStockCount={lowStockCount}
        newOrdersCount={newOrdersCount}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAddProduct={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
          onOpenWhatsApp={() => handleOpenWhatsApp()}
          setActiveTab={setActiveTab}
          lowStockCount={lowStockCount}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className="flex-1 p-6 overflow-y-auto">
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
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onViewOrderDetails={(order) => setSelectedOrder(order)}
              onSendWhatsApp={handleOpenWhatsApp}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'customers' && (
            <Customers
              customers={customers}
              onSendWhatsApp={handleOpenWhatsApp}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'suppliers' && (
            <Suppliers suppliers={suppliers} />
          )}

          {activeTab === 'reports' && (
            <Reports
              orders={orders}
              products={products}
              stats={storeStats}
            />
          )}

          {activeTab === 'whatsapp' && (
            <div className="max-w-2xl mx-auto pt-6">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <span className="text-3xl">💬</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-100">WhatsApp Müşteri İletişim Entegrasyonu</h2>
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
              onResetDemoData={handleResetDemoData}
              onImportData={handleImportData}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
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
