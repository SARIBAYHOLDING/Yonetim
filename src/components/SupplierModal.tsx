import React, { useState, useEffect } from 'react';
import { X, Truck, Star, CheckCircle } from 'lucide-react';
import type { Supplier, Category, RegionalOrigin } from '../types';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplierData: Partial<Supplier>) => void;
  initialSupplier?: Supplier | null;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSupplier
}) => {
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState<RegionalOrigin>('Rize / Karadeniz');
  const [city, setCity] = useState('');
  const [suppliedCategories, setSuppliedCategories] = useState<Category[]>(['Bal & Arı Ürünleri']);
  const [rating, setRating] = useState(5.0);
  const [isCertifiedOrganic, setIsCertifiedOrganic] = useState(true);

  const availableCategories: Category[] = [
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

  useEffect(() => {
    if (initialSupplier) {
      setName(initialSupplier.name);
      setContactPerson(initialSupplier.contactPerson);
      setPhone(initialSupplier.phone);
      setEmail(initialSupplier.email);
      setRegion(initialSupplier.region);
      setCity(initialSupplier.city);
      setSuppliedCategories(initialSupplier.suppliedCategories || []);
      setRating(initialSupplier.rating);
      setIsCertifiedOrganic(initialSupplier.isCertifiedOrganic);
    } else {
      setName('');
      setContactPerson('');
      setPhone('05');
      setEmail('');
      setRegion('Rize / Karadeniz');
      setCity('Rize');
      setSuppliedCategories(['Bal & Arı Ürünleri']);
      setRating(4.9);
      setIsCertifiedOrganic(true);
    }
  }, [initialSupplier, isOpen]);

  if (!isOpen) return null;

  const toggleCategory = (cat: Category) => {
    if (suppliedCategories.includes(cat)) {
      setSuppliedCategories(suppliedCategories.filter(c => c !== cat));
    } else {
      setSuppliedCategories([...suppliedCategories, cat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      contactPerson,
      phone,
      email,
      region,
      city,
      suppliedCategories,
      rating: Number(rating),
      isCertifiedOrganic
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl p-6 relative my-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-100 text-lg">
              {initialSupplier ? 'Tedarikçi / Kooperatif Düzenle' : 'Yeni Tedarikçi Ekle'}
            </h3>
            <p className="text-xs text-slate-400">Yöresel üretici, kooperatif ve sertifika detayları</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Tedarikçi / Kooperatif Adı:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Anzer Çiçek Balı Kooperatifi"
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Yetkili Kişi Ad Soyad:</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Örn: Mehmet Ali Şahin"
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Telefon Numarası:</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05..."
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">E-Posta Adresi:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@kooperatif.org"
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Coğrafi Bölge / Yöre:</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as RegionalOrigin)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
              >
                {origins.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">İl / Şehir:</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Örn: Rize, Kars, Gaziantep"
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Güvenilirlik Puanı (1.0 - 5.0):</label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-32 p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-amber-400 font-bold focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex items-center text-amber-400 space-x-1">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-xs font-bold">{rating} Puan</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Tedarik Edilen Ürün Kategorileri:</label>
            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950 rounded-xl border border-slate-800">
              {availableCategories.map((cat) => {
                const isSelected = suppliedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2 bg-slate-950 border border-slate-700 p-3 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={isCertifiedOrganic}
                onChange={(e) => setIsCertifiedOrganic(e.target.checked)}
                className="rounded accent-emerald-500 w-4 h-4"
              />
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-300 font-bold">Resmi Organik & Hijyen Sertifikalı Üretici</span>
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
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-950 transition-all"
            >
              {initialSupplier ? 'Güncelle' : 'Tedarikçiyi Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
