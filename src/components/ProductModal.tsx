import React, { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import type { Product, Category, RegionalOrigin, ProductUnit } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => void;
  initialProduct?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct
}) => {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Bal & Arı Ürünleri');
  const [origin, setOrigin] = useState<RegionalOrigin>('Rize / Karadeniz');
  const [unit, setUnit] = useState<ProductUnit>('kg');
  const [unitAmount, setUnitAmount] = useState(1);
  const [buyPrice, setBuyPrice] = useState(100);
  const [sellPrice, setSellPrice] = useState(160);
  const [stockQuantity, setStockQuantity] = useState(20);
  const [minStockAlert, setMinStockAlert] = useState(5);
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [supplierName, setSupplierName] = useState('Hasbahçe Doğal Kooperatif');
  const [isOrganic, setIsOrganic] = useState(true);
  const [isGeographicalIndication, setIsGeographicalIndication] = useState(true);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialProduct) {
      setSku(initialProduct.sku);
      setName(initialProduct.name);
      setCategory(initialProduct.category);
      setOrigin(initialProduct.origin);
      setUnit(initialProduct.unit);
      setUnitAmount(initialProduct.unitAmount);
      setBuyPrice(initialProduct.buyPrice);
      setSellPrice(initialProduct.sellPrice);
      setStockQuantity(initialProduct.stockQuantity);
      setMinStockAlert(initialProduct.minStockAlert);
      setExpiryDate(initialProduct.expiryDate);
      setSupplierName(initialProduct.supplierName);
      setIsOrganic(initialProduct.isOrganic);
      setIsGeographicalIndication(initialProduct.isGeographicalIndication);
      setImage(initialProduct.image);
      setDescription(initialProduct.description);
    } else {
      setSku(`HB-${Math.floor(1000 + Math.random() * 9000)}`);
      setName('');
      setCategory('Bal & Arı Ürünleri');
      setOrigin('Rize / Karadeniz');
      setUnit('kg');
      setUnitAmount(1);
      setBuyPrice(150);
      setSellPrice(240);
      setStockQuantity(25);
      setMinStockAlert(5);
      setExpiryDate('2027-12-31');
      setSupplierName('Rize Anzer Kooperatifi');
      setIsOrganic(true);
      setIsGeographicalIndication(true);
      setImage('https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80');
      setDescription('');
    }
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      sku,
      name,
      category,
      origin,
      unit,
      unitAmount: Number(unitAmount),
      buyPrice: Number(buyPrice),
      sellPrice: Number(sellPrice),
      stockQuantity: Number(stockQuantity),
      minStockAlert: Number(minStockAlert),
      expiryDate,
      supplierName,
      isOrganic,
      isGeographicalIndication,
      image: image || 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80',
      description
    });
    onClose();
  };

  const categories: Category[] = [
    'Bal & Arı Ürünleri',
    'Peynir & Süt Ürünleri',
    'Zeytin & Zeytinyağı',
    'Tereyağı & Şarküteri',
    'Kuruyemiş & Kuru Meyve',
    'Reçel & Pekmez & Sirke',
    'Salça & Sos & Baharat',
    'Çay & Yöresel İçecekler',
    'Pestil & Köme & Tatlı'
  ];

  const origins: RegionalOrigin[] = [
    'Rize / Karadeniz',
    'Kars / Doğu Anadolu',
    'Ayvalık / Ege',
    'Malatya / Doğu Anadolu',
    'Gaziantep / Güneydoğu',
    'Trabzon / Karadeniz',
    'Hatay / Akdeniz',
    'Bursa / Marmara',
    'Afyon / Ege',
    'Erzurum / Doğu Anadolu'
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative my-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-100 text-lg">
              {initialProduct ? 'Yöresel Ürün Düzenle' : 'Yeni Yöresel Ürün Ekle'}
            </h3>
            <p className="text-xs text-slate-400">Tescilli gıda detayları ve stok parametreleri</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Ürün Adı:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Hakiki Anzer Balı"
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">SKU / Barkod Kodu:</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Kategori:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Coğrafi Yöre:</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value as RegionalOrigin)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
              >
                {origins.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Alış Fiyatı (₺):</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={buyPrice}
                onChange={(e) => setBuyPrice(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Satış Fiyatı (₺):</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={sellPrice}
                onChange={(e) => setSellPrice(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Stok Miktarı:</label>
              <input
                type="number"
                required
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Kritik Stok Uyarı Limiti:</label>
              <input
                type="number"
                required
                min="1"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-amber-400 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Son Tüketim Tarihi (STT):</label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Ürün Görsel URL:</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Certification Toggles */}
          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center space-x-2 bg-slate-950 border border-slate-700 px-3 py-2 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={isGeographicalIndication}
                onChange={(e) => setIsGeographicalIndication(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span className="text-xs text-amber-300 font-semibold flex items-center">
                🏅 Coğrafi İşaretli Tescilli Ürün
              </span>
            </label>

            <label className="flex items-center space-x-2 bg-slate-950 border border-slate-700 px-3 py-2 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={isOrganic}
                onChange={(e) => setIsOrganic(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span className="text-xs text-emerald-300 font-semibold flex items-center">
                🌿 Organik Sertifikalı
              </span>
            </label>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Ürün Açıklaması:</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Yöresel lezzetin hikayesi ve yapılış özellikleri..."
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
            ></textarea>
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950"
            >
              {initialProduct ? 'Değişiklikleri Kaydet' : 'Ürünü Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
