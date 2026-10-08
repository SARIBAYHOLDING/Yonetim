import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Database, RefreshCw, Download, Upload, CheckCircle2, GitBranch, Building, Save } from 'lucide-react';
import type { Product, Order, Customer, Supplier, StoreSettings } from '../types';

interface SettingsProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  suppliers: Supplier[];
  storeSettings: StoreSettings;
  onSaveStoreSettings: (settings: StoreSettings) => void;
  onResetDemoData: () => void;
  onImportData: (json: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  products,
  orders,
  customers,
  suppliers,
  storeSettings,
  onSaveStoreSettings,
  onResetDemoData,
  onImportData
}) => {
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(storeSettings);

  useEffect(() => {
    setSettingsForm(storeSettings);
  }, [storeSettings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveStoreSettings(settingsForm);
  };

  const handleExportJSON = () => {
    const data = { 
      storeSettings,
      products, 
      orders, 
      customers, 
      suppliers, 
      exportedAt: new Date().toISOString() 
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hasbahce_yonetim_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportData(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5 text-emerald-400" />
          <h1 className="text-xl font-extrabold text-slate-100">Mağaza Profil & Sistem Ayarları</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Mağaza kimlik bilgileri, fatura/kargo varsayılanları, veri yedeği ve GitHub entegrasyonu.
        </p>
      </div>

      {/* Editable Store Profile Settings Form */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-100 text-base">Mağaza Kimliği ve Fatura Parametreleri</h3>
            <p className="text-xs text-slate-400">PDF faturalar ve sistem bildirimlerinde kullanılan resmi veriler</p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Mağaza Ticari Unvanı:</label>
              <input
                type="text"
                required
                value={settingsForm.storeName}
                onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Telefon Numarası:</label>
              <input
                type="text"
                required
                value={settingsForm.storePhone}
                onChange={(e) => setSettingsForm({ ...settingsForm, storePhone: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">E-Posta Adresi:</label>
              <input
                type="email"
                required
                value={settingsForm.storeEmail}
                onChange={(e) => setSettingsForm({ ...settingsForm, storeEmail: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Vergi Dairesi:</label>
              <input
                type="text"
                value={settingsForm.taxOffice}
                onChange={(e) => setSettingsForm({ ...settingsForm, taxOffice: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Vergi Kimlik No / Mersis:</label>
              <input
                type="text"
                value={settingsForm.taxNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, taxNumber: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Varsayılan Kargo Ücreti (₺):</label>
              <input
                type="number"
                min="0"
                value={settingsForm.defaultShippingFee}
                onChange={(e) => setSettingsForm({ ...settingsForm, defaultShippingFee: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Ücretsiz Kargo Limiti (₺):</label>
              <input
                type="number"
                min="0"
                value={settingsForm.freeShippingThreshold}
                onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Banka Adı:</label>
              <input
                type="text"
                value={settingsForm.bankName}
                onChange={(e) => setSettingsForm({ ...settingsForm, bankName: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Banka Hesap Sahibi:</label>
              <input
                type="text"
                value={settingsForm.bankAccountHolder}
                onChange={(e) => setSettingsForm({ ...settingsForm, bankAccountHolder: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Banka IBAN Numarası:</label>
            <input
              type="text"
              value={settingsForm.bankIban}
              onChange={(e) => setSettingsForm({ ...settingsForm, bankIban: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-emerald-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Açık Mağaza Adresi:</label>
            <textarea
              rows={2}
              value={settingsForm.storeAddress}
              onChange={(e) => setSettingsForm({ ...settingsForm, storeAddress: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 flex items-center space-x-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Mağaza Ayarlarını Kaydet</span>
            </button>
          </div>
        </form>
      </div>

      {/* GitHub Repository Status Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-100">
              <GitBranch className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-sm">Otomatik Git Depo Entegrasyonu</h3>
              <p className="text-xs text-slate-400 font-mono">https://github.com/SARIBAYHOLDING/Yonetim.git</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Bağlantı Hazır
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Tüm kod ve proje yapılanması SARIBAYHOLDING/Yonetim ana reposuna commitlemeye ve pushlamaya hazırdır. 
        </p>
      </div>

      {/* Data Backup & Restore */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* JSON Export/Import */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Database className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold text-slate-100 text-base">Veri Yedeği Al / Yükle</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Ürünler, siparişler, müşteriler, tedarikçi verileri ve mağaza ayarlarını JSON dosyası olarak indirin veya başka cihazdan içe aktarın.
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={handleExportJSON}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-teal-950"
            >
              <Download className="w-4 h-4" />
              <span>Tüm Verileri JSON Olarak İndir</span>
            </button>

            <label className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all border border-slate-700 cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>JSON Yedek Dosyası Yükle</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
        </div>

        {/* Reset Demo Data */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <RefreshCw className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-slate-100 text-base">Demo Verilerini Sıfırla</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Hasbahçe Yöresel orijinal örnek ürün ve sipariş veri setini fabrika ayarlarına geri getirin.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Hasbahçe varsayılan demo verilerine sıfırlamak istediğinize emin misiniz?')) {
                onResetDemoData();
              }
            }}
            className="w-full py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 border border-amber-500/30 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Orijinal Örnek Verilere Dön</span>
          </button>
        </div>
      </div>
    </div>
  );
};
