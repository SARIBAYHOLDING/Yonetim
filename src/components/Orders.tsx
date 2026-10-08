import React, { useState } from 'react';
import { 
  ShoppingCart, 
  FileText, 
  MessageSquare, 
  Eye
} from 'lucide-react';
import type { Order, OrderStatus } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { generateOrderInvoicePDF } from '../utils/pdfGenerator';

interface OrdersProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, cargoCompany?: any, trackingNo?: string) => void;
  onViewOrderDetails: (order: Order) => void;
  onSendWhatsApp: (phone: string, text: string) => void;
  searchQuery: string;
}

export const Orders: React.FC<OrdersProps> = ({
  orders,
  onUpdateOrderStatus,
  onViewOrderDetails,
  onSendWhatsApp,
  searchQuery
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('Tümü');

  const statusTabs = ['Tümü', 'Yeni', 'Hazırlanıyor', 'Kargoda', 'Teslim Edildi', 'İptal'];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);

    const matchesStatus = statusFilter === 'Tümü' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Sipariş & Kargo Yönetimi</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gelen siparişler, kargo takip barkodları ve WhatsApp bildirimleri.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            Toplam: <strong className="text-emerald-400">{orders.length} Sipariş</strong>
          </span>
        </div>
      </div>

      {/* Status Pipeline Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {statusTabs.map((tab) => {
          const count = tab === 'Tümü' ? orders.length : orders.filter(o => o.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                statusFilter === tab
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                statusFilter === tab ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">SİPARİŞ KODU & TARİH</th>
                <th className="py-3.5 px-4">MÜŞTERİ BİLGİSİ</th>
                <th className="py-3.5 px-4">İÇERİK</th>
                <th className="py-3.5 px-4">TUTAR & ÖDEME</th>
                <th className="py-3.5 px-4">KARGO / TAKİP NO</th>
                <th className="py-3.5 px-4 text-center">DURUM</th>
                <th className="py-3.5 px-4 text-right">HIZLI İŞLEMLER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredOrders.map((order) => {
                return (
                  <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                    {/* Order Number & Date */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-100 text-sm">{order.orderNumber}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(order.createdAt)}</p>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-200">{order.customerName}</p>
                      <p className="text-[11px] text-slate-400">{order.city} | {order.customerPhone}</p>
                    </td>

                    {/* Items */}
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-300 line-clamp-1">
                        {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </p>
                      <p className="text-[10px] text-slate-400">{order.items.length} Kalem Ürün</p>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-4">
                      <p className="font-extrabold font-mono text-emerald-400 text-sm">{formatCurrency(order.totalAmount)}</p>
                      <p className="text-[10px] text-slate-400">{order.paymentMethod}</p>
                    </td>

                    {/* Cargo & Tracking */}
                    <td className="py-3 px-4">
                      {order.trackingNumber ? (
                        <div>
                          <span className="font-semibold text-slate-200 block text-[11px]">{order.cargoCompany}</span>
                          <span className="font-mono text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                            {order.trackingNumber}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Henüz Takip Girilmedi</span>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4 text-center">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                          order.status === 'Teslim Edildi' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          order.status === 'Kargoda' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          order.status === 'Hazırlanıyor' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                          order.status === 'Yeni' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                          'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}
                      >
                        <option value="Yeni" className="bg-slate-900 text-slate-100">Yeni</option>
                        <option value="Hazırlanıyor" className="bg-slate-900 text-slate-100">Hazırlanıyor</option>
                        <option value="Kargoda" className="bg-slate-900 text-slate-100">Kargoda</option>
                        <option value="Teslim Edildi" className="bg-slate-900 text-slate-100">Teslim Edildi</option>
                        <option value="İptal" className="bg-slate-900 text-slate-100">İptal</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => onViewOrderDetails(order)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Detay İncele"
                      >
                        <Eye className="w-4 h-4 text-emerald-400" />
                      </button>

                      <button
                        onClick={() => generateOrderInvoicePDF(order)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Fatura / PDF Yazdır"
                      >
                        <FileText className="w-4 h-4 text-amber-400" />
                      </button>

                      <button
                        onClick={() => {
                          const msg = `Sayın ${order.customerName}, Hasbahçe Yöresel siparişiniz (${order.orderNumber}) güncellenmiştir. Durum: ${order.status}. Kargo: ${order.cargoCompany || 'Hazırlık aşamasında'}.`;
                          onSendWhatsApp(order.customerPhone, msg);
                        }}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        title="WhatsApp İle Bildirim Gönder"
                      >
                        <MessageSquare className="w-4 h-4 text-green-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
