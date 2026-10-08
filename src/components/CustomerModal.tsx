import React, { useState, useEffect } from 'react';
import { X, UserPlus, Crown } from 'lucide-react';
import type { Customer } from '../types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: Partial<Customer>) => void;
  initialCustomer?: Customer | null;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCustomer
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [isVip, setIsVip] = useState(false);

  useEffect(() => {
    if (initialCustomer) {
      setName(initialCustomer.name);
      setPhone(initialCustomer.phone);
      setEmail(initialCustomer.email);
      setCity(initialCustomer.city);
      setAddress(initialCustomer.address);
      setIsVip(initialCustomer.isVip);
    } else {
      setName('');
      setPhone('05');
      setEmail('');
      setCity('İstanbul');
      setAddress('');
      setIsVip(false);
    }
  }, [initialCustomer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      phone,
      email,
      city,
      address,
      isVip
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative my-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-100 text-lg">
              {initialCustomer ? 'Müşteri Düzenle' : 'Yeni Müşteri Kaydı'}
            </h3>
            <p className="text-xs text-slate-400">Hasbahçe CRM müşteri kartı ve iletişim profili</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Müşteri Ad Soyad:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Ahmet Yılmaz"
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Telefon Numarası:</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0532 000 00 00"
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">E-Posta Adresi:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Şehir / İl:</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Örn: İstanbul, Ankara, Rize..."
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Teslimat / Fatura Adresi:</label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Mahalle, Cadde, Sokak, No, Daire..."
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-teal-500"
            ></textarea>
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2 bg-slate-950 border border-slate-700 p-3 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={isVip}
                onChange={(e) => setIsVip(e.target.checked)}
                className="rounded accent-amber-500 w-4 h-4"
              />
              <div className="flex items-center space-x-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-amber-300 font-bold">Hasbahçe Sadakat Kulübü VIP Üyesi</span>
              </div>
            </label>
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
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-950 transition-all"
            >
              {initialCustomer ? 'Güncelle' : 'Müşteriyi Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
