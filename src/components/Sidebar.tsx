import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Truck, 
  FileText, 
  MessageSquare, 
  Settings, 
  Award
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'products' | 'orders' | 'customers' | 'suppliers' | 'reports' | 'whatsapp' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lowStockCount: number;
  newOrdersCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  lowStockCount,
  newOrdersCount
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Genel Bakış & Analiz', icon: LayoutDashboard },
    { id: 'products', label: 'Ürün & Stok Yönetimi', icon: Package, badge: lowStockCount > 0 ? lowStockCount : null, badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    { id: 'orders', label: 'Siparişler', icon: ShoppingCart, badge: newOrdersCount > 0 ? newOrdersCount : null, badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    { id: 'customers', label: 'Müşteri İlişkileri (CRM)', icon: Users },
    { id: 'suppliers', label: 'Yöresel Üreticiler', icon: Truck },
    { id: 'reports', label: 'PDF Raporlar & Analitik', icon: FileText },
    { id: 'whatsapp', label: 'WhatsApp İletişim', icon: MessageSquare, badge: 'Canlı', badgeColor: 'bg-green-500/20 text-green-400 border border-green-500/30' },
    { id: 'settings', label: 'Sistem & Git Ayarları', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 backdrop-blur-xl z-20">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/40 text-white font-black text-xl">
            🌿
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-slate-100 tracking-tight text-base">HASBAHÇE</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-1.5 py-0.5 rounded border border-amber-500/30">
                YÖRESEL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Yönetim Paneli v2.5</p>
          </div>
        </div>

        {/* Quality Certification Tag */}
        <div className="mx-4 mt-4 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 flex items-center space-x-2 text-xs text-emerald-300">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">Coğrafi İşaret Tescilli Lezzetler</span>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-900/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <p className="text-xs font-semibold text-slate-300">Canlı Sistem Bağlantısı</p>
            <p className="text-[11px] text-slate-500">SARIBAYHOLDING / Yonetim</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
