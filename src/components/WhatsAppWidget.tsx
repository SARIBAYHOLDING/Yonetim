import React, { useState } from 'react';
import { MessageSquare, X, Send, Phone, Copy, Check } from 'lucide-react';
import { formatPhoneForWhatsApp } from '../utils/formatters';

interface WhatsAppWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPhone?: string;
  defaultText?: string;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  isOpen,
  onClose,
  defaultPhone = '',
  defaultText = ''
}) => {
  const [phone, setPhone] = useState(defaultPhone || '+90 532 000 0000');
  const [text, setText] = useState(
    defaultText || 'Sayın müşterimiz, Hasbahçe Yöresel siparişinizle ilgili bilgilendirme yapmak için iletişime geçiyoruz.'
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const templates = [
    {
      title: '📦 Kargo & Sipariş Bilgisi',
      text: 'Sayın Müşterimiz, Hasbahçe Yöresel siparişiniz kargoya verilmiştir! Kargo Takip No ile siparişinizi takip edebilirsiniz. Afiyet olsun!'
    },
    {
      title: '🍯 Özel İndirim & Taze Sürgün',
      text: 'Merhaba, Hasbahçe Yöresel yeni sezon taze Anzer balı ve Trabzon yayık tereyağı stoklarımıza girdi! Web sitemizden hemen sipariş verebilirsiniz.'
    },
    {
      title: '🌱 Tedarikçi Stok Sorgulama',
      text: 'Sayın Üreticimiz, Hasbahçe Yöresel depomuzda stoklarımız azalmaktadır. Yeni parti sevkıyat takvimi hakkında bilgi alabilir miyiz?'
    },
    {
      title: '💬 Genel Müşteri Desteği',
      text: 'Merhaba! Hasbahçe Yöresel Destek Ekibi olarak size yardımcı olmaktan mutluluk duyarız. Sorunuz nedir?'
    }
  ];

  const handleSend = () => {
    const formatted = formatPhoneForWhatsApp(phone);
    const url = `https://wa.me/${formatted}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-100 text-base">WhatsApp Hızlı İletişim Entegrasyonu</h3>
            <p className="text-xs text-slate-400">Tek tıkla müşteriye veya tedarikçiye direkt mesaj yollayın</p>
          </div>
        </div>

        {/* Template Quick Selection */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-300 block mb-2">Hazır Mesaj Şablonları:</label>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((tpl, i) => (
              <button
                key={i}
                onClick={() => setText(tpl.text)}
                className="text-left text-xs p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all font-medium line-clamp-1"
              >
                {tpl.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Telefon Numarası (WhatsApp):</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+90 5xx xxx xx xx"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Gönderilecek Mesaj:</label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-3 py-2 rounded-xl transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
          </button>

          <button
            onClick={handleSend}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-green-950 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>WhatsApp Web'de Aç & Gönder</span>
          </button>
        </div>
      </div>
    </div>
  );
};
