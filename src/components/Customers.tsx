import React from 'react';
import { Users, Crown, MessageSquare, Phone, Mail, MapPin, ShoppingBag } from 'lucide-react';
import type { Customer } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface CustomersProps {
  customers: Customer[];
  onSendWhatsApp: (phone: string, text: string) => void;
  searchQuery: string;
}

export const Customers: React.FC<CustomersProps> = ({
  customers,
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
            <Users className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Müşteri İlişkileri (CRM)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hasbahçe sadakat kulübü, harcama geçmişi ve direkt WhatsApp iletişimi.
          </p>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((c) => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white text-sm shadow">
                    {c.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-bold text-slate-100 text-sm">{c.name}</h3>
                      {c.isVip && (
                        <span className="flex items-center space-x-1 text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                          <Crown className="w-3 h-3 text-amber-400" />
                          <span>VIP</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 mr-1 text-emerald-400" /> {c.city}
                    </p>
                  </div>
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
    </div>
  );
};
