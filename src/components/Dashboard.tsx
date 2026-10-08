import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  AlertTriangle, 
  Award, 
  MapPin, 
  ArrowUpRight, 
  PackageCheck,
  ChevronRight
} from 'lucide-react';
import type { Product, Order, StoreStats } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface DashboardProps {
  products: Product[];
  orders: Order[];
  stats: StoreStats;
  onViewOrder: (order: Order) => void;
  onRestockProduct: (product: Product) => void;
  setActiveTab: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  products,
  orders,
  stats,
  onViewOrder,
  onRestockProduct,
  setActiveTab
}) => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');

  // Filtered low stock products
  const lowStockProducts = products.filter(p => p.stockQuantity <= p.minStockAlert);

  // Sales Trend Mock Points for SVG Chart
  const salesDataPoints = [
    { label: '1 Ekim', value: 12400 },
    { label: '2 Ekim', value: 18900 },
    { label: '3 Ekim', value: 15200 },
    { label: '4 Ekim', value: 24800 },
    { label: '5 Ekim', value: 31000 },
    { label: '6 Ekim', value: 28400 },
    { label: '7 Ekim', value: 42100 },
    { label: '8 Ekim', value: 48500 },
  ];

  const maxSales = Math.max(...salesDataPoints.map(d => d.value));

  // Regional distribution mock
  const regionalSales = [
    { region: 'Karadeniz (Rize, Trabzon)', orders: 340, percent: 32, topProduct: 'Anzer Balı & Trabzon Yağı' },
    { region: 'Ege (Ayvalık, Muğla)', orders: 280, percent: 26, topProduct: 'Erken Hasat Zeytinyağı' },
    { region: 'Doğu Anadolu (Kars, Malatya)', orders: 210, percent: 20, topProduct: 'Eski Kaşar & Günkurusu' },
    { region: 'Güneydoğu (Gaziantep, Urfa)', orders: 130, percent: 12, topProduct: 'Boz İç Antep Fıstığı' },
    { region: 'Marmara & Diğer', orders: 110, percent: 10, topProduct: 'Bursa Kestane Şekeri' },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Top Banner & Greetings */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/20 p-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/5 blur-3xl pointer-events-none"></div>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Hasbahçe Canlı Mağaza Paneli</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Yöresel Ürün Satış Analitiği
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Tescilli coğrafi işaretli doğal ürünler, stok takibi ve canlı sipariş akışı.
          </p>
        </div>

        {/* Time Filter Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          {(['today', 'week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                timeRange === range
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {range === 'today' ? 'Bugün' : range === 'week' ? 'Bu Hafta' : range === 'month' ? 'Bu Ay' : 'Bu Yıl'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Toplam Ciro</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100 tracking-tight">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+%18.4 geçen aya göre</span>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Toplam Sipariş</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100 tracking-tight">
            {stats.totalOrdersCount} Sipariş
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-teal-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>%96 Tamamlanma Oranı</span>
          </div>
        </div>

        {/* KPI 3: Average Basket Value */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Ortalama Sepet</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100 tracking-tight">
            {formatCurrency(stats.avgOrderValue)}
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-amber-400 font-semibold">
            <span>Kar Marjı: ~%38</span>
          </div>
        </div>

        {/* KPI 4: Certified Regional Product Share */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Coğrafi İşaretli</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100 tracking-tight">
            %{stats.geographicalCertifiedPercent} Satış Payı
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-purple-400 font-semibold">
            <span>Anzer, Kars, Ayvalık Tescilli</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Regional Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG Sales Trend Chart (Span 2) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-100">Günlük Ciro Trend Grafiği</h3>
              <p className="text-xs text-slate-400 mt-0.5">Ekim 2026 Sürekli Satış Grafiği</p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              <span>Peak: ₺48,500</span>
            </div>
          </div>

          {/* SVG Dynamic Line Chart */}
          <div className="h-64 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 50, 100, 150].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="500"
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="4 4"
                  strokeWidth="0.8"
                />
              ))}

              {/* Gradient Fill */}
              <polygon
                fill="url(#chartGradient)"
                points={`0,200 ${salesDataPoints.map((d, i) => {
                  const x = (i / (salesDataPoints.length - 1)) * 500;
                  const y = 200 - (d.value / maxSales) * 160;
                  return `${x},${y}`;
                }).join(' ')} 500,200`}
              />

              {/* Dynamic Line */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={salesDataPoints.map((d, i) => {
                  const x = (i / (salesDataPoints.length - 1)) * 500;
                  const y = 200 - (d.value / maxSales) * 160;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Data Dots & Hover Labels */}
              {salesDataPoints.map((d, i) => {
                const x = (i / (salesDataPoints.length - 1)) * 500;
                const y = 200 - (d.value / maxSales) * 160;
                return (
                  <g key={i} className="group/point cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      className="fill-emerald-400 stroke-slate-900 stroke-[3px] transition-all group-hover/point:r-8 group-hover/point:fill-amber-400"
                    />
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      className="fill-slate-300 text-[10px] font-bold opacity-0 group-hover/point:opacity-100 transition-opacity"
                    >
                      ₺{d.value.toLocaleString()}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between mt-4 text-[11px] text-slate-400 font-medium">
              {salesDataPoints.map((d, idx) => (
                <span key={idx}>{d.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Origins Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-100">Yöresel Kaynak Dağılımı</h3>
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400 mb-4">Bölgelere göre sipariş oranı & popüler lezzetler</p>

            <div className="space-y-3.5">
              {regionalSales.map((r, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200">{r.region}</span>
                    <span className="text-emerald-400">%{r.percent} ({r.orders} sipariş)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${r.percent}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-400">En Çok Satılan: <span className="text-slate-300 font-medium">{r.topProduct}</span></p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('suppliers')}
            className="w-full mt-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-all"
          >
            <span>Tedarikçi & Üretici Haritası</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Low Stock Alerts & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Stock Alert Box */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100">Kritik Stok Uyarısı ({lowStockProducts.length})</h3>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              Tüm Ürünleri Gör
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <PackageCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              Tüm ürünlerin stok seviyesi güvenli bölgede!
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-bold text-slate-100">{p.name}</p>
                      <p className="text-[11px] text-slate-400">Yöre: {p.origin} | SKU: {p.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-400 block">{p.stockQuantity} {p.unit} Kaldı</span>
                    <button
                      onClick={() => onRestockProduct(p)}
                      className="mt-1 text-[11px] bg-amber-500 hover:bg-amber-600 text-slate-950 px-2.5 py-1 rounded-lg font-bold transition-all"
                    >
                      + Stok Ekle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders Live Stream */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-100">Son Siparişler</h3>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              Tüm Siparişler ({orders.length})
            </button>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                onClick={() => onViewOrder(order)}
                className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl flex items-center justify-between cursor-pointer transition-all"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-100">{order.orderNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.status === 'Teslim Edildi' ? 'bg-emerald-500/20 text-emerald-400' :
                      order.status === 'Kargoda' ? 'bg-blue-500/20 text-blue-400' :
                      order.status === 'Hazırlanıyor' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{order.customerName} ({order.city})</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{order.items.length} Kalem Ürün • {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-400 block">{formatCurrency(order.totalAmount)}</span>
                  <span className="text-[10px] text-slate-400">{order.paymentMethod}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
