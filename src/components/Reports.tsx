import React from 'react';
import { FileText, Printer, TrendingUp, Package } from 'lucide-react';
import type { Order, Product, StoreStats } from '../types';
import { generateSalesReportPDF, generateInventoryReportPDF } from '../utils/pdfGenerator';

interface ReportsProps {
  orders: Order[];
  products: Product[];
  stats: StoreStats;
}

export const Reports: React.FC<ReportsProps> = ({ orders, products, stats }) => {
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <h1 className="text-xl font-extrabold text-slate-100">PDF Raporlama & Resmi Belge Merkezi</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Anlık yazdırılabilir, A4 PDF formatında resmi Hasbahçe Yöresel satış, envanter ve irsaliye belgeleri üretin.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report 1: Sales & Financial Performance */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-emerald-500/40 transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-100 text-lg">Genel Satış & Performans PDF Raporu</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Toplam ciro, sipariş hacmi, ortalama sepet büyüklüğü, coğrafi tescilli ürün satış oranları ve dönemsel sipariş listesini içeren resmi yönetim kurulu raporu.
            </p>
            <div className="mt-4 p-3 bg-slate-950/60 rounded-xl text-xs space-y-1 text-slate-300">
              <p>• Toplam Ciro: <strong className="text-emerald-400 font-mono">₺{stats.totalRevenue.toLocaleString('tr-TR')}</strong></p>
              <p>• Toplam Sipariş: <strong>{stats.totalOrdersCount} Sipariş</strong></p>
              <p>• Tarih: <strong>Canlı Güncel Veri</strong></p>
            </div>
          </div>

          <button
            onClick={() => generateSalesReportPDF(orders, stats)}
            className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>PDF Satış Raporu Oluştur & Yazdır</span>
          </button>
        </div>

        {/* Report 2: Inventory & Stock Audit */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-emerald-500/40 transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-100 text-lg">Stok Envanter & Değerleme Raporu</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Tüm ürünlerin stok miktarları, alış/satış tutarları, toplam depo sermaye değeri ve son tüketim tarihlerini (STT) listeleyen ayrıntılı stok sayım cetveli.
            </p>
            <div className="mt-4 p-3 bg-slate-950/60 rounded-xl text-xs space-y-1 text-slate-300">
              <p>• Kayıtlı Ürün Sayısı: <strong>{products.length} Kalem</strong></p>
              <p>• Kritik Stok Uyarısı: <strong className="text-amber-400">{products.filter(p => p.stockQuantity <= p.minStockAlert).length} Ürün</strong></p>
              <p>• Tarih: <strong>Canlı Sayım</strong></p>
            </div>
          </div>

          <button
            onClick={() => generateInventoryReportPDF(products)}
            className="w-full mt-6 py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-950 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>PDF Envanter Raporu Oluştur & Yazdır</span>
          </button>
        </div>
      </div>
    </div>
  );
};
