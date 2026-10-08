import type { Order, Product, StoreStats } from '../types';
import { formatCurrency, formatDate } from './formatters';

export function generateOrderInvoicePDF(order: Order): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const invoiceHTML = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>Hasbahçe Yöresel - Fatura / İrsaliye #${order.orderNumber}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 40px;
          color: #1e293b;
          background: #fff;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #047857;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .brand-title {
          font-size: 26px;
          font-weight: 800;
          color: #047857;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .brand-sub {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
        }
        .doc-title {
          text-align: right;
        }
        .doc-title h2 {
          margin: 0;
          font-size: 20px;
          color: #0f172a;
        }
        .doc-title p {
          margin: 4px 0 0;
          font-size: 13px;
          color: #64748b;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }
        .card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
        }
        .card h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #047857;
        }
        .card p {
          margin: 4px 0;
          font-size: 13px;
          color: #334155;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          background: #047857;
          color: white;
          text-align: left;
          padding: 10px 14px;
          font-size: 12px;
          text-transform: uppercase;
        }
        td {
          padding: 12px 14px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 13px;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .text-right {
          text-align: right;
        }
        .totals-table {
          width: 320px;
          margin-left: auto;
          margin-bottom: 30px;
        }
        .totals-table td {
          padding: 6px 12px;
          border-bottom: none;
        }
        .totals-table tr.grand-total {
          border-top: 2px solid #047857;
          font-weight: bold;
          font-size: 16px;
          color: #047857;
        }
        .footer {
          margin-top: 50px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          text-align: center;
          font-size: 11px;
          color: #94a3b8;
        }
        .stamp-box {
          border: 2px dashed #047857;
          color: #047857;
          width: 160px;
          padding: 10px;
          text-align: center;
          font-weight: bold;
          font-size: 12px;
          border-radius: 6px;
          margin-top: 20px;
        }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="brand-title">HASBAHÇE YÖRESEL</h1>
          <div class="brand-sub">Doğal & Geleneksel Yöresel Lezzetler Yönetim Merkezi</div>
        </div>
        <div class="doc-title">
          <h2>RESMİ İRSALİYELİ FATURA</h2>
          <p><strong>Sipariş No:</strong> ${order.orderNumber}</p>
          <p><strong>Tarih:</strong> ${formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div class="info-grid">
        <div class="card">
          <h3>Müşteri & Teslimat Bilgileri</h3>
          <p><strong>Ad Soyad:</strong> ${order.customerName}</p>
          <p><strong>Telefon:</strong> ${order.customerPhone}</p>
          <p><strong>E-Posta:</strong> ${order.customerEmail}</p>
          <p><strong>Teslimat Adresi:</strong> ${order.deliveryAddress}, ${order.city}</p>
        </div>
        <div class="card">
          <h3>Kargo & Ödeme Detayları</h3>
          <p><strong>Ödeme Tipi:</strong> ${order.paymentMethod}</p>
          <p><strong>Kargo Firması:</strong> ${order.cargoCompany || 'Atanmadı'}</p>
          <p><strong>Kargo Takip No:</strong> ${order.trackingNumber || 'Süreçte'}</p>
          <p><strong>Sipariş Durumu:</strong> <span style="color:#047857; font-weight:bold;">${order.status}</span></p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Ürün Adı</th>
            <th>Birim</th>
            <th class="text-right">Birim Fiyat</th>
            <th class="text-right">Adet</th>
            <th class="text-right">Toplam</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map((item, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td><strong>${item.productName}</strong></td>
              <td>${item.unit}</td>
              <td class="text-right">${formatCurrency(item.unitPrice)}</td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">${formatCurrency(item.totalPrice)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <table class="totals-table">
        <tr>
          <td>Ara Toplam:</td>
          <td class="text-right">${formatCurrency(order.subtotal)}</td>
        </tr>
        <tr>
          <td>KDV Tahmini:</td>
          <td class="text-right">${formatCurrency(order.taxAmount)}</td>
        </tr>
        <tr>
          <td>Kargo Ücreti:</td>
          <td class="text-right">${order.shippingFee === 0 ? 'ÜCRETSİZ' : formatCurrency(order.shippingFee)}</td>
        </tr>
        <tr class="grand-total">
          <td>Genel Toplam:</td>
          <td class="text-right">${formatCurrency(order.totalAmount)}</td>
        </tr>
      </table>

      <div style="display: flex; justify-content: space-between; align-items: flex-end;">
        <div class="stamp-box">
          HASBAHÇE YÖRESEL<br>
          RESMİ ONAY MÜHRÜ<br>
          ✓ KONTROL EDİLDİ
        </div>
        <div style="text-align: right; font-size: 12px; color: #64748b;">
          Teslim Eden: Hasbahçe Depo Sorumlusu<br>
          Teslim Alan İmzası: ____________________
        </div>
      </div>

      <div class="footer">
        Hasbahçe Yöresel Gıda ve Organik Ürünler Ltd. Şti. | Mersis: 0458921049281 | www.hasbahceeyoresel.com<br>
        Bu belge elektronik olarak Hasbahçe Yönetim Paneli üzerinden oluşturulmuştur.
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(invoiceHTML);
  printWindow.document.close();
}

export function generateSalesReportPDF(orders: Order[], stats: StoreStats): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const reportHTML = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>Hasbahçe Yöresel - Satış ve Performans Raporu</title>
      <style>
        body { font-family: sans-serif; padding: 30px; color: #1e293b; }
        .header { border-bottom: 3px solid #047857; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; }
        h1 { color: #047857; margin: 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
        .stat-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 15px; text-align: center; }
        .stat-val { font-size: 20px; font-weight: bold; color: #047857; }
        .stat-lbl { font-size: 12px; color: #475569; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #047857; color: white; padding: 8px; font-size: 12px; text-align: left; }
        td { padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>HASBAHÇE YÖRESEL</h1>
          <p style="margin:4px 0 0; color:#64748b;">Genel Satış ve Performans Raporu</p>
        </div>
        <div style="text-align:right;">
          <p style="margin:0; font-weight:bold;">Rapor Tarihi: ${formatDate(new Date().toISOString())}</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-val">${formatCurrency(stats.totalRevenue)}</div>
          <div class="stat-lbl">Toplam Satış Ciro</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${stats.totalOrdersCount}</div>
          <div class="stat-lbl">Sipariş Adedi</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${formatCurrency(stats.avgOrderValue)}</div>
          <div class="stat-lbl">Ortalama Sepet Tutarı</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">%${stats.geographicalCertifiedPercent}</div>
          <div class="stat-lbl">Coğrafi İşaretli Ürün Oranı</div>
        </div>
      </div>

      <h2>Son Sipariş Özeti</h2>
      <table>
        <thead>
          <tr>
            <th>Sipariş No</th>
            <th>Müşteri</th>
            <th>Şehir</th>
            <th>Tarih</th>
            <th>Durum</th>
            <th style="text-align:right;">Tutar</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(o => `
            <tr>
              <td><strong>${o.orderNumber}</strong></td>
              <td>${o.customerName}</td>
              <td>${o.city}</td>
              <td>${formatDate(o.createdAt)}</td>
              <td>${o.status}</td>
              <td style="text-align:right; font-weight:bold;">${formatCurrency(o.totalAmount)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `;

  printWindow.document.write(reportHTML);
  printWindow.document.close();
}

export function generateInventoryReportPDF(products: Product[]): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const totalValue = products.reduce((acc, p) => acc + (p.stockQuantity * p.sellPrice), 0);

  const reportHTML = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>Hasbahçe Yöresel - Ürün ve Stok Envanter Raporu</title>
      <style>
        body { font-family: sans-serif; padding: 30px; color: #1e293b; }
        .header { border-bottom: 3px solid #047857; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; }
        h1 { color: #047857; margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #047857; color: white; padding: 8px; font-size: 11px; text-align: left; }
        td { padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
        .text-right { text-align: right; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>HASBAHÇE YÖRESEL</h1>
          <p style="margin:4px 0 0; color:#64748b;">Güncel Stok & Envanter Değerleme Raporu</p>
        </div>
        <div style="text-align:right;">
          <p style="margin:0; font-weight:bold;">Tarih: ${formatDate(new Date().toISOString())}</p>
          <p style="margin:4px 0 0; color:#047857; font-weight:bold;">Toplam Stok Değeri: ${formatCurrency(totalValue)}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Ürün Adı</th>
            <th>Kategori</th>
            <th>Yöre</th>
            <th class="text-right">Alış Fiyatı</th>
            <th class="text-right">Satış Fiyatı</th>
            <th class="text-right">Stok</th>
            <th class="text-right">Toplam Değer</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td><code>${p.sku}</code></td>
              <td><strong>${p.name}</strong> ${p.isGeographicalIndication ? '🏅' : ''}</td>
              <td>${p.category}</td>
              <td>${p.origin}</td>
              <td class="text-right">${formatCurrency(p.buyPrice)}</td>
              <td class="text-right">${formatCurrency(p.sellPrice)}</td>
              <td class="text-right" style="${p.stockQuantity <= p.minStockAlert ? 'color:red; font-weight:bold;' : ''}">${p.stockQuantity} ${p.unit}</td>
              <td class="text-right"><strong>${formatCurrency(p.stockQuantity * p.sellPrice)}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `;

  printWindow.document.write(reportHTML);
  printWindow.document.close();
}
