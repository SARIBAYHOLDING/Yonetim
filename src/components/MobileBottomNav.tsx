import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Truck
} from 'lucide-react';
import type { ActiveTab } from './Sidebar';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lowStockCount: number;
  newOrdersCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  lowStockCount,
  newOrdersCount
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
    { id: 'products', label: 'Ürünler', icon: Package, badge: lowStockCount > 0 ? lowStockCount : null },
    { id: 'orders', label: 'Siparişler', icon: ShoppingCart, badge: newOrdersCount > 0 ? newOrdersCount : null },
    { id: 'customers', label: 'Müşteriler', icon: Users },
    { id: 'suppliers', label: 'Üreticiler', icon: Truck },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800/90 backdrop-blur-xl px-2 py-1.5 flex justify-around items-center shadow-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
              isActive
                ? 'text-emerald-400 font-extrabold bg-emerald-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400 scale-110' : 'text-slate-400'}`} />
              {tab.badge && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
