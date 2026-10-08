import React from 'react';
import { Settings as SettingsIcon, Database, RefreshCw, Download, Upload, CheckCircle2, GitBranch } from 'lucide-react';
import type { Product, Order, Customer, Supplier } from '../types';

interface SettingsProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  suppliers: Supplier[];
  onResetDemoData: () => void;
  onImportData: (json: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  products,
  orders,
  customers,
  suppliers,
  onResetDemoData,
  onImportData
}) => {
  const handleExportJSON = () => {
    const data = { products, orders, customers, suppliers, exportedAt: new Date().toISOString() };
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
          <h1 className="text-xl font-extrabold text-slate-100">Sistem & Git Konfigürasyonu</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Veri tabanı yedekleme, varsayılan demo verisi sıfırlama ve GitHub repomuzla senkronizasyon.
        </p>
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
              Ürünler, siparişler, müşteriler ve tedarikçi verilerini JSON dosyası olarak indirin veya başka cihazdan içe aktarın.
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
