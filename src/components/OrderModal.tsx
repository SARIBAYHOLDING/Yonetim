import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Trash2 } from 'lucide-react';
import type { Order, OrderItem, Product, Customer, OrderStatus } from '../types';
import { formatCurrency } from '../utils/formatters';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderData: Partial<Order>) => void;
  initialOrder?: Order | null;
  products: Product[];
  customers: Customer[];
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialOrder,
  products,
  customers
}) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('İstanbul');
  const [paymentMethod, setPaymentMethod] = useState<'Kredi Kartı' | 'Havale/EFT' | 'Kapıda Ödeme'>('Kredi Kartı');
  const [status, setStatus] = useState<OrderStatus>('Yeni');
  const [cargoCompany, setCargoCompany] = useState<'Yurtiçi Kargo' | 'Aras Kargo' | 'Trendyol Express' | 'MNG Kargo' | 'Sürat Kargo' | 'PTT Kargo'>('Yurtiçi Kargo');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingFee, setShippingFee] = useState(0);
  const [notes, setNotes] = useState('');

  // Selected Order Items
  const [items, setItems] = useState<OrderItem[]>([]);

  // Item Addition temporary state
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  useEffect(() => {
    if (initialOrder) {
      setOrderNumber(initialOrder.orderNumber);
      setCustomerName(initialOrder.customerName);
      setCustomerPhone(initialOrder.customerPhone);
      setCustomerEmail(initialOrder.customerEmail);
      setDeliveryAddress(initialOrder.deliveryAddress);
      setCity(initialOrder.city);
      setPaymentMethod(initialOrder.paymentMethod);
      setStatus(initialOrder.status);
      setCargoCompany(initialOrder.cargoCompany || 'Yurtiçi Kargo');
      setTrackingNumber(initialOrder.trackingNumber || '');
      setShippingFee(initialOrder.shippingFee);
      setNotes(initialOrder.notes || '');
      setItems(initialOrder.items || []);
    } else {
      setOrderNumber(`HB-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      setCustomerName('');
      setCustomerPhone('05');
      setCustomerEmail('');
      setDeliveryAddress('');
      setCity('İstanbul');
      setPaymentMethod('Kredi Kartı');
      setStatus('Yeni');
      setCargoCompany('Yurtiçi Kargo');
      setTrackingNumber('');
      setShippingFee(0);
      setNotes('');
      // Default with first product if available
      if (products.length > 0) {
        setItems([
          {
            productId: products[0].id,
            productName: products[0].name,
            quantity: 1,
            unitPrice: products[0].sellPrice,
            totalPrice: products[0].sellPrice,
            unit: products[0].unit
          }
        ]);
      } else {
        setItems([]);
      }
    }
  }, [initialOrder, isOpen, products]);

  if (!isOpen) return null;

  const handleSelectCustomer = (custId: string) => {
    const cust = customers.find(c => c.id === custId);
    if (cust) {
      setCustomerName(cust.name);
      setCustomerPhone(cust.phone);
      setCustomerEmail(cust.email);
      setCity(cust.city);
      setDeliveryAddress(cust.address);
    }
  };

  const handleAddItem = () => {
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    const existingIndex = items.findIndex(i => i.productId === prod.id);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += selectedQuantity;
      updated[existingIndex].totalPrice = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          productId: prod.id,
          productName: prod.name,
          quantity: selectedQuantity,
          unitPrice: prod.sellPrice,
          totalPrice: prod.sellPrice * selectedQuantity,
          unit: prod.unit
        }
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleUpdateItemQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) return;
    const updated = [...items];
    updated[index].quantity = newQty;
    updated[index].totalPrice = newQty * updated[index].unitPrice;
    setItems(updated);
  };

  // Calculations
  const subtotal = items.reduce((acc, i) => acc + i.totalPrice, 0);
  const taxAmount = Math.round(subtotal * 0.10); // KDV %10
  const totalAmount = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Lütfen en az bir ürün ekleyin!');
      return;
    }

    onSave({
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      city,
      items,
      subtotal,
      shippingFee: Number(shippingFee),
      taxAmount,
      totalAmount,
      status,
      cargoCompany,
      trackingNumber,
      paymentMethod,
      notes,
      createdAt: initialOrder ? initialOrder.createdAt : new Date().toISOString().slice(0, 10)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl p-6 relative my-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-100 text-lg">
              {initialOrder ? `Sipariş Düzenle #${initialOrder.orderNumber}` : 'Yeni Sipariş Oluştur'}
            </h3>
            <p className="text-xs text-slate-400">Müşteri siparişi, kalem listesi ve kargo yönetimi</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Quick Select Customer */}
          {customers.length > 0 && !initialOrder && (
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <label className="text-[11px] font-bold text-emerald-400 block mb-1">
                Kayıtlı Müşteri Seçin (Opsiyonel Hızlı Doldurma):
              </label>
              <select
                onChange={(e) => handleSelectCustomer(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
              >
                <option value="">-- Yeni Müşteri Girişi Yap --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.city} - {c.phone})</option>
                ))}
              </select>
            </div>
          )}

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Müşteri Ad Soyad:</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Örn: Ayşe Kaya"
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Telefon Numarası:</label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="05..."
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">E-Posta Adresi:</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="ornek@domain.com"
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Şehir / İl:</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Örn: İstanbul, Rize..."
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Teslimat Adresi:</label>
            <input
              type="text"
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Adres açıklaması..."
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Add Item Section */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200">Sipariş Kalemi Ekle:</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100"
              >
                <option value="">-- Ürün Seçin --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - {formatCurrency(p.sellPrice)} / {p.unit} (Stok: {p.stockQuantity})</option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                className="w-24 p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-center text-slate-100"
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Ekle</span>
              </button>
            </div>

            {/* Selected Items Table */}
            {items.length > 0 ? (
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden mt-3">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-semibold">
                    <tr>
                      <th className="p-2.5">Ürün Adı</th>
                      <th className="p-2.5 text-right">Birim Fiyat</th>
                      <th className="p-2.5 text-center">Adet</th>
                      <th className="p-2.5 text-right">Toplam</th>
                      <th className="p-2.5 text-center">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 text-slate-200 font-medium">{item.productName}</td>
                        <td className="p-2.5 text-right font-mono text-slate-400">{formatCurrency(item.unitPrice)}</td>
                        <td className="p-2.5 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItemQuantity(idx, Number(e.target.value))}
                            className="w-16 p-1 bg-slate-950 border border-slate-700 rounded text-center text-xs font-bold text-slate-100"
                          />
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-400">{formatCurrency(item.totalPrice)}</td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic text-center py-2">Henüz sipariş kalemi eklenmedi.</p>
            )}
          </div>

          {/* Payment & Logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Ödeme Yöntemi:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100"
              >
                <option value="Kredi Kartı">Kredi Kartı</option>
                <option value="Havale/EFT">Havale/EFT</option>
                <option value="Kapıda Ödeme">Kapıda Ödeme</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Sipariş Durumu:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-emerald-400"
              >
                <option value="Yeni">Yeni</option>
                <option value="Hazırlanıyor">Hazırlanıyor</option>
                <option value="Kargoda">Kargoda</option>
                <option value="Teslim Edildi">Teslim Edildi</option>
                <option value="İptal">İptal</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Kargo Ücreti (₺):</label>
              <input
                type="number"
                min="0"
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Kargo Firması:</label>
              <select
                value={cargoCompany}
                onChange={(e) => setCargoCompany(e.target.value as any)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100"
              >
                <option value="Yurtiçi Kargo">Yurtiçi Kargo</option>
                <option value="Trendyol Express">Trendyol Express</option>
                <option value="Aras Kargo">Aras Kargo</option>
                <option value="MNG Kargo">MNG Kargo</option>
                <option value="Sürat Kargo">Sürat Kargo</option>
                <option value="PTT Kargo">PTT Kargo</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Kargo Takip No:</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Örn: YK9821389..."
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Sipariş Notları:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: Hediye paketi yapılsın, öğleden sonra teslim..."
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100"
            />
          </div>

          {/* Totals Summary */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Ara Toplam:</span>
              <span className="font-mono text-slate-200">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>KDV (%10 Dahil):</span>
              <span className="font-mono text-slate-200">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Kargo:</span>
              <span className="font-mono text-slate-200">{shippingFee === 0 ? 'ÜCRETSİZ' : formatCurrency(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-emerald-400 pt-2 border-t border-slate-800">
              <span>Genel Toplam:</span>
              <span className="font-mono">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 transition-all"
            >
              {initialOrder ? 'Siparişi Güncelle' : 'Siparişi Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
