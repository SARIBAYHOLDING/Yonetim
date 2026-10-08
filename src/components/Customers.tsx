import React from 'react';
import { Users, Crown, MessageSquare, Phone, Mail, MapPin, ShoppingBag, Plus, Edit3, Trash2 } from 'lucide-react';
import type { Customer } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface CustomersProps {
  customers: Customer[];
  onAddCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onToggleVip: (id: string) => void;
  onSendWhatsApp: (phone: string, text: string) => void;
  searchQuery: string;
}

export const Customers: React.FC<CustomersProps> = ({
  customers,
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onToggleVip,
  onSendWhatsApp,
  searchQuery
}) => {
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-teal-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Müşteri İlişkileri (CRM)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hasbahçe sadakat kulübü, müşteri kartları, vip üyeler ve direkt iletişim.
          </p>
        </div>

        <button
          onClick={onAddCustomer}
          className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-teal-950 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Müşteri Ekle</span>
        </button>
      </div>

      {/* Customer Cards Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center my-4">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">Müşteri Bulunamadı</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Arama kriterlerinize uyan müşteri bulunamadı ya da henüz müşteri kaydınız yok.
          </p>
          <button
            onClick={onAddCustomer}
            className="mt-4 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-950 inline-flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Müşteri Ekle</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((c) => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center font-bold text-white text-sm shadow">
                    {c.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-bold text-slate-100 text-sm">{c.name}</h3>
                      <button
                        onClick={() => onToggleVip(c.id)}
                        title={c.isVip ? "VIP Statüsünü Kaldır" : "VIP Statüsü Ver"}
                        className={`flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                          c.isVip
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-amber-300'
                        }`}
                      >
                        <Crown className={`w-3 h-3 ${c.isVip ? 'text-amber-400' : 'text-slate-500'}`} />
                        <span>VIP</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 mr-1 text-teal-400" /> {c.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEditCustomer(c)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Müşteriyi Düzenle"
                  >
                    <Edit3 className="w-4 h-4 text-teal-400" />
                  </button>
                  <button
                    onClick={() => onDeleteCustomer(c.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Müşteriyi Sil"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Sipariş Sayısı</span>
                  <span className="font-bold text-slate-200 text-sm flex items-center mt-0.5">
                    <ShoppingBag className="w-3.5 h-3.5 mr-1 text-teal-400" /> {c.totalOrders} Sipariş
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Toplam Harcama</span>
                  <span className="font-extrabold text-emerald-400 text-sm mt-0.5 block font-mono">
                    {formatCurrency(c.totalSpent)}
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-400">
                <p className="flex items-center"><Phone className="w-3.5 h-3.5 mr-2 text-slate-500" /> {c.phone}</p>
                <p className="flex items-center"><Mail className="w-3.5 h-3.5 mr-2 text-slate-500" /> {c.email}</p>
                {c.address && (
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">🏠 {c.address}</p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Son Sipariş: {formatDate(c.lastOrderDate)}</span>
              <button
                onClick={() => onSendWhatsApp(c.phone, `Merhaba Sayın ${c.name}, Hasbahçe Yöresel olarak siparişlerinizle ilgili size nasıl yardımcı olabiliriz?`)}
                className="flex items-center space-x-1.5 text-xs bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-500/30 px-3 py-1.5 rounded-xl font-medium transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp İletişim</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
