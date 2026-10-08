import type { Product } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: dateString.includes('T') ? '2-digit' : undefined,
    minute: dateString.includes('T') ? '2-digit' : undefined
  }).format(date);
}

export function formatPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    return '90' + cleaned.substring(1);
  }
  if (cleaned.startsWith('90')) {
    return cleaned;
  }
  return '90' + cleaned;
}

export function getStockStatusBadge(product: Product): { label: string; color: string; bg: string } {
  if (product.stockQuantity <= 0) {
    return { label: 'Tükendi', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
  }
  if (product.stockQuantity <= product.minStockAlert) {
    return { label: 'Kritik Stok', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
  }
  return { label: 'Stokta Var', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
}
