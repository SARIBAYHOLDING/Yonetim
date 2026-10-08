import React, { useState } from 'react';
import { X, ShoppingBag, FileText, MessageSquare, Truck } from 'lucide-react';
import type { Order, OrderStatus } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { generateOrderInvoicePDF } from '../utils/pdfGenerator';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, cargoCompany?: any, trackingNo?: string) => void;
  onSendWhatsApp: (phone: string, text: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onSendWhatsApp
}) => {
  if (!order) return null;

  const [cargoCompany, setCargoCompany] = useState(order.cargoCompany || 'Yurtiçi Kargo');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');

  const handleSaveCargo = () => {
    onUpdateStatus(order.id, order.status, cargoCompany, trackingNumber);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative my-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-slate-100 text-lg">Sipariş #{order.orderNumber}</h3>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Sipariş Tarihi: {formatDate(order.createdAt)}</p>
            </div>
          </div>

          <button
            onClick={() => generateOrderInvoicePDF(order)}
            className="flex items-center space-x-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Resmi Fatura PDF</span>
          </button>
        </div>

        {/* Customer & Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950/60 rounded-xl border border-slate-800 mb-5">
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Müşteri Detayları</h4>
            <p className="text-xs font-bold text-slate-100">{order.customerName}</p>
            <p className="text-xs text-slate-300 mt-1">📞 {order.customerPhone}</p>
            <p className="text-xs text-slate-400 mt-0.5">✉️ {order.customerEmail}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Teslimat Adresi</h4>
            <p className="text-xs text-slate-200">{order.deliveryAddress}</p>
            <p className="text-xs font-bold text-emerald-300 mt-1">📍 {order.city}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-slate-300 mb-2">Sipariş Kalemleri:</h4>
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-semibold">
                <tr>
                  <th className="p-2.5">Ürün Adı</th>
                  <th className="p-2.5 text-right">Birim Fiyat</th>
                  <th className="p-2.5 text-right">Adet</th>
                  <th className="p-2.5 text-right">Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 text-slate-200 font-medium">{item.productName}</td>
                    <td className="p-2.5 text-right font-mono text-slate-400">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-2.5 text-right text-slate-200 font-bold">{item.quantity} {item.unit}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-emerald-400">{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Summary */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 mb-5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Ara Toplam:</span>
            <span className="font-mono text-slate-200">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>KDV Tutarı:</span>
            <span className="font-mono text-slate-200">{formatCurrency(order.taxAmount)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Kargo Ücreti:</span>
            <span className="font-mono text-slate-200">{order.shippingFee === 0 ? 'ÜCRETSİZ' : formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-emerald-400 pt-2 border-t border-slate-800">
            <span>Genel Toplam:</span>
            <span className="font-mono">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Cargo Assignment Section */}
        <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 space-y-3 mb-5">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
            <Truck className="w-4 h-4 text-blue-400" />
            <span>Kargo ve Lojistik Bilgisi Güncelle:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={cargoCompany}
              onChange={(e) => setCargoCompany(e.target.value as any)}
              className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100"
            >
              <option value="Yurtiçi Kargo">Yurtiçi Kargo</option>
              <option value="Trendyol Express">Trendyol Express</option>
              <option value="Aras Kargo">Aras Kargo</option>
              <option value="MNG Kargo">MNG Kargo</option>
              <option value="Sürat Kargo">Sürat Kargo</option>
            </select>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Takip Barkod No Girin..."
              className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-100"
            />
          </div>
          <button
            onClick={handleSaveCargo}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all"
          >
            Kargo Bilgilerini Kaydet
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              const msg = `Sayın ${order.customerName}, Hasbahçe Yöresel siparişiniz (${order.orderNumber}) hazırlandı. Kargo Takip No: ${trackingNumber || 'Süreçte'}. Afiyet olsun!`;
              onSendWhatsApp(order.customerPhone, msg);
            }}
            className="flex items-center space-x-1.5 bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-500/30 font-bold text-xs px-4 py-2 rounded-xl transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp ile Müşteriye Bildir</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
