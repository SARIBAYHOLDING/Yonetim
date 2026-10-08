import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  MessageSquare, 
  FileText, 
  Sun, 
  Moon, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import type { ActiveTab } from './Sidebar';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenAddProduct: () => void;
  onOpenWhatsApp: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  lowStockCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenAddProduct,
  onOpenWhatsApp,
  setActiveTab,
  lowStockCount,
  darkMode,
  setDarkMode
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Global Search Bar */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ürün, sipariş, müşteri veya SKU ara..."
          className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
        />
      </div>

      {/* Right Actions & Utilities */}
      <div className="flex items-center space-x-3">
        {/* Quick Action Buttons */}
        <button
          onClick={onOpenAddProduct}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl shadow-md shadow-emerald-950/40 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Ürün Ekle</span>
        </button>

        <button
          onClick={onOpenWhatsApp}
          className="flex items-center space-x-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 font-medium text-xs px-3 py-2 rounded-xl transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp Destek</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs px-3 py-2 rounded-xl border border-slate-700 transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>PDF Rapor</span>
        </button>

        <div className="h-6 w-px bg-slate-800 my-auto"></div>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 relative transition-colors"
            title="Bildirimler"
          >
            <Bell className="w-4 h-4" />
            {lowStockCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-slate-900 animate-ping"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <h4 className="font-semibold text-sm text-slate-100">Sistem Bildirimleri</h4>
                <span className="text-xs text-slate-400">Canlı</span>
              </div>
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {lowStockCount > 0 && (
                  <div 
                    onClick={() => { setActiveTab('products'); setShowNotifications(false); }}
                    className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-2.5 cursor-pointer hover:bg-amber-500/20 transition-all"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-300">Stok Uyarısı</p>
                      <p className="text-[11px] text-slate-300">{lowStockCount} üründe kritik stok seviyesine ulaşıldı.</p>
                    </div>
                  </div>
                )}
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-300">Git Entegrasyonu Hazır</p>
                    <p className="text-[11px] text-slate-300">https://github.com/SARIBAYHOLDING/Yonetim.git senkronize edilebilir.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Tema Değiştir"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>

        {/* User Profile Badge */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xs shadow">
            HY
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-200 leading-none">Hasbahçe Admin</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Sarıbay Holding</p>
          </div>
        </div>
      </div>
    </header>
  );
};
