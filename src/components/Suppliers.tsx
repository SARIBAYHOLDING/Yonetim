import React from 'react';
import { Truck, Star, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import type { Supplier } from '../types';

interface SuppliersProps {
  suppliers: Supplier[];
}

export const Suppliers: React.FC<SuppliersProps> = ({ suppliers }) => {
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Yöresel Üreticiler & Kooperatifler</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Anadolu'nun dört bir yanından yerel üreticiler, organik sertifika sertifikasyonu ve tedarik ağı.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">{s.region}</span>
                  <h3 className="font-extrabold text-slate-100 text-base mt-0.5">{s.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Yetkili: {s.contactPerson}</p>
                </div>
                <div className="flex items-center space-x-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-lg text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{s.rating}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.isCertifiedOrganic && (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-emerald-400" /> Organik Sertifikalı
                  </span>
                )}
                {s.suppliedCategories.map((cat, i) => (
                  <span key={i} className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                    {cat}
                  </span>
                ))}
              </div>

              <div className="mt-4 space-y-1 text-xs text-slate-400">
                <p className="flex items-center"><Phone className="w-3.5 h-3.5 mr-2 text-slate-500" /> {s.phone}</p>
                <p className="flex items-center"><Mail className="w-3.5 h-3.5 mr-2 text-slate-500" /> {s.email}</p>
                <p className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-2 text-slate-500" /> {s.city}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Tedarikçi Statüsü: <strong className="text-emerald-400">Aktif</strong></span>
              <a
                href={`tel:${s.phone}`}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl font-semibold transition-all"
              >
                Hızlı Ara
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
