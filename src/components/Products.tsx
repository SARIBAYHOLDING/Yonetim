import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Filter, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  MinusCircle, 
  Grid, 
  List
} from 'lucide-react';
import type { Product } from '../types';
import { formatCurrency, getStockStatusBadge } from '../utils/formatters';

interface ProductsProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateStock: (id: string, delta: number) => void;
  searchQuery: string;
}

export const Products: React.FC<ProductsProps> = ({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateStock,
  searchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [stockFilter, setStockFilter] = useState<'all' | 'critical' | 'out' | 'certified'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const categories = [
    'Tümü',
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

  // Filtering Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.origin.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Tümü' || product.category === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'critical') matchesStock = product.stockQuantity <= product.minStockAlert && product.stockQuantity > 0;
    if (stockFilter === 'out') matchesStock = product.stockQuantity <= 0;
    if (stockFilter === 'certified') matchesStock = product.isGeographicalIndication;

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6 pb-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Ürün & Stok Kataloğu</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Toplam {products.length} ürün kaydı. Yöresel tescilli gıdalar ve envanter yönetimi.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Liste Görünümü"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Kart Görünümü"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onAddProduct}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Yeni Yöresel Ürün Ekle</span>
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="space-y-3">
        {/* Category Scrollable Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Stok Filtresi:
          </span>
          <button
            onClick={() => setStockFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${stockFilter === 'all' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'}`}
          >
            Tümü
          </button>
          <button
            onClick={() => setStockFilter('critical')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${stockFilter === 'critical' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-900/60 border-slate-800 text-slate-400'}`}
          >
            ⚠️ Kritik Stok
          </button>
          <button
            onClick={() => setStockFilter('out')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${stockFilter === 'out' ? 'bg-red-500/20 border-red-500/40 text-red-300' : 'bg-slate-900/60 border-slate-800 text-slate-400'}`}
          >
            🚫 Tükendi
          </button>
          <button
            onClick={() => setStockFilter('certified')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${stockFilter === 'certified' ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-slate-900/60 border-slate-800 text-slate-400'}`}
          >
            🏅 Coğrafi İşaretliler
          </button>
        </div>
      </div>

      {/* Products Display (Table or Grid) */}
      {viewMode === 'table' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Ürün & SKU</th>
                  <th className="py-3.5 px-4">Kategori & Yöre</th>
                  <th className="py-3.5 px-4">Alış Fiyatı</th>
                  <th className="py-3.5 px-4">Satış Fiyatı</th>
                  <th className="py-3.5 px-4">Kar Marjı</th>
                  <th className="py-3.5 px-4 text-center">Stok & STT</th>
                  <th className="py-3.5 px-4 text-center">Durum</th>
                  <th className="py-3.5 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProducts.map((product) => {
                  const badge = getStockStatusBadge(product);
                  const marginPercent = Math.round(((product.sellPrice - product.buyPrice) / product.sellPrice) * 100);

                  return (
                    <tr key={product.id} className="hover:bg-slate-800/50 transition-colors">
                      {/* Product Name & Image */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-700/60 shrink-0"
                          />
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-slate-100 text-sm">{product.name}</span>
                              {product.isGeographicalIndication && (
                                <span title="Coğrafi İşaretli Tescilli Ürün" className="text-amber-400">🏅</span>
                              )}
                              {product.isOrganic && (
                                <span title="Organik Sertifikalı" className="text-emerald-400">🌿</span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                              {product.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Origin */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-200">{product.category}</p>
                        <p className="text-[11px] text-slate-400 flex items-center mt-0.5">
                          📍 {product.origin}
                        </p>
                      </td>

                      {/* Buy Price */}
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {formatCurrency(product.buyPrice)}
                      </td>

                      {/* Sell Price */}
                      <td className="py-3 px-4 font-bold font-mono text-emerald-400">
                        {formatCurrency(product.sellPrice)}
                      </td>

                      {/* Profit Margin */}
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          +%{marginPercent}
                        </span>
                      </td>

                      {/* Stock & Quick Adjust */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => onUpdateStock(product.id, -1)}
                            className="text-slate-400 hover:text-red-400 p-0.5 rounded transition-colors"
                            title="1 Azalt"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>

                          <span className={`font-black text-sm font-mono px-2 py-0.5 rounded ${
                            product.stockQuantity <= product.minStockAlert ? 'text-amber-400 bg-amber-500/10' : 'text-slate-100'
                          }`}>
                            {product.stockQuantity} {product.unit}
                          </span>

                          <button
                            onClick={() => onUpdateStock(product.id, 1)}
                            className="text-slate-400 hover:text-emerald-400 p-0.5 rounded transition-colors"
                            title="1 Arttır"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">STT: {product.expiryDate}</p>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${badge.bg} ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => onEditProduct(product)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                          title="Düzenle"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(product.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((p) => {
            const badge = getStockStatusBadge(p);
            return (
              <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="h-40 relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${badge.bg} ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="absolute bottom-2 left-2 text-[10px] font-mono bg-slate-950/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {p.origin}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-slate-100 text-sm line-clamp-1">{p.name}</h4>
                    <p className="text-xs text-slate-400">{p.category}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Satış Fiyatı</span>
                        <span className="font-black text-emerald-400 text-base">{formatCurrency(p.sellPrice)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Stok Adedi</span>
                        <span className="font-bold text-slate-200 text-sm">{p.stockQuantity} {p.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onUpdateStock(p.id, 5)}
                      className="text-[11px] bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg font-bold hover:bg-emerald-600/30"
                    >
                      +5 Stok
                    </button>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => onEditProduct(p)} className="p-1 text-slate-400 hover:text-emerald-400">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDeleteProduct(p.id)} className="p-1 text-slate-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
