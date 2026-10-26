/**
 * Export Service for Sardar Mart Furniture and Home Appliances
 * Handles multi-sheet Excel (.xls / SpreadsheetML), CSV, and Print-to-PDF generation.
 */

// Format numbers as Indian Rupee
const formatINR = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

// Clean XML text for Excel SpreadsheetML
const escapeXml = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Clean CSV fields
const escapeCSV = (val) => {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
};

/**
 * 1. EXPORT TO MULTI-SHEET EXCEL WORKBOOK (.XLS / SpreadsheetML)
 * Supported natively by Microsoft Excel, Google Sheets, LibreOffice, Numbers
 */
export function exportToExcel({
  activeProducts = [],
  orders = [],
  customerList = [],
  reviews = [],
  stats = {},
  storeSettings = {}
}) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const totalRevenue = stats.totalRevenue || orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalInventoryValue = stats.totalInventoryValue || activeProducts.reduce((sum, p) => sum + ((Number(p.price) || 0) * (Number(p.stock) || 10)), 0);

  // XML Header & Styles
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="HeaderTitle">
   <Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#8c3b10"/>
   <Interior ss:Color="#FFF3EC" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="SubHeader">
   <Font ss:FontName="Calibri" ss:Size="10" ss:Italic="1" ss:Color="#6E584F"/>
  </Style>
  <Style ss:ID="TableHeader">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#8C3B10"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#2A1810" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="CurrencyCell">
   <Alignment ss:Horizontal="Right"/>
   <NumberFormat ss:Format="&#34;₹&#34;#,##0"/>
  </Style>
  <Style ss:ID="NumberCell">
   <Alignment ss:Horizontal="Right"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
  <Style ss:ID="CenterCell">
   <Alignment ss:Horizontal="Center"/>
  </Style>
  <Style ss:ID="BoldCell">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1"/>
  </Style>
  <Style ss:ID="HighlightGold">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#B45309"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
  </Style>
 </Styles>
`;

  // ----------------------------------------------------
  // SHEET 1: EXECUTIVE SUMMARY
  // ----------------------------------------------------
  xml += ` <Worksheet ss:Name="Executive Summary">
  <Table ss:DefaultColumnWidth="140">
   <Column ss:Width="200"/>
   <Column ss:Width="220"/>
   <Column ss:Width="160"/>
   <Row ss:Height="28">
    <Cell ss:MergeAcross="2" ss:StyleID="HeaderTitle"><Data ss:Type="String">SARDAR MART FURNITURE &amp; ELECTRONICS - EXECUTIVE SUMMARY</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="2" ss:StyleID="SubHeader"><Data ss:Type="String">Official Store Analytics &amp; Inventory Valuation Report • Generated on ${escapeXml(dateStr)} at ${escapeXml(timeStr)}</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="2" ss:StyleID="SubHeader"><Data ss:Type="String">GSTIN: 33DVKPR2334L1Z9 • Flagship Showroom: No. 192, E.H Road, Vyasarpadi, Chennai - 39 • Ph: 6383056338</Data></Cell>
   </Row>
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:Height="22">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Key Business Performance Metric</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Value</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Status / Context</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="BoldCell"><Data ss:Type="String">Total Realized Revenue</Data></Cell>
    <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">${totalRevenue}</Data></Cell>
    <Cell ss:StyleID="HighlightGold"><Data ss:Type="String">Total Sales Realized</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="BoldCell"><Data ss:Type="String">Catalog Inventory Valuation</Data></Cell>
    <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">${totalInventoryValue}</Data></Cell>
    <Cell><Data ss:Type="String">Based on Live Active Stock</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="BoldCell"><Data ss:Type="String">Total Completed Orders</Data></Cell>
    <Cell ss:StyleID="NumberCell"><Data ss:Type="Number">${orders.length}</Data></Cell>
    <Cell><Data ss:Type="String">Verified Counter &amp; Online Orders</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="BoldCell"><Data ss:Type="String">Active Catalog SKU Count</Data></Cell>
    <Cell ss:StyleID="NumberCell"><Data ss:Type="Number">${activeProducts.length}</Data></Cell>
    <Cell><Data ss:Type="String">Published Models in Database</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="BoldCell"><Data ss:Type="String">Registered Customers Count</Data></Cell>
    <Cell ss:StyleID="NumberCell"><Data ss:Type="Number">${customerList.length}</Data></Cell>
    <Cell><Data ss:Type="String">Showroom Client Directory</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="BoldCell"><Data ss:Type="String">Customer Feedback &amp; Reviews</Data></Cell>
    <Cell ss:StyleID="NumberCell"><Data ss:Type="Number">${reviews.length}</Data></Cell>
    <Cell><Data ss:Type="String">Average Rating 4.8 / 5.0</Data></Cell>
   </Row>
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:Height="22">
    <Cell ss:MergeAcross="2" ss:StyleID="TableHeader"><Data ss:Type="String">Departmental Inventory Breakdown</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Furniture Department</Data></Cell>
    <Cell ss:StyleID="NumberCell"><Data ss:Type="Number">${activeProducts.filter(p => p.category === 'furniture').length}</Data></Cell>
    <Cell><Data ss:Type="String">Living, Bedroom &amp; Dining Sets</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Electronics Department</Data></Cell>
    <Cell ss:StyleID="NumberCell"><Data ss:Type="Number">${activeProducts.filter(p => p.category === 'electronics').length}</Data></Cell>
    <Cell><Data ss:Type="String">Smart 4K TVs, Audio &amp; Accessories</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Home Appliances Department</Data></Cell>
    <Cell ss:StyleID="NumberCell"><Data ss:Type="Number">${activeProducts.filter(p => p.category === 'appliances').length}</Data></Cell>
    <Cell><Data ss:Type="String">Refrigerators, Washers &amp; Kitchen</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
`;

  // ----------------------------------------------------
  // SHEET 2: ORDERS & SALES
  // ----------------------------------------------------
  xml += ` <Worksheet ss:Name="Orders &amp; Sales">
  <Table ss:DefaultColumnWidth="120">
   <Column ss:Width="110"/>
   <Column ss:Width="130"/>
   <Column ss:Width="140"/>
   <Column ss:Width="110"/>
   <Column ss:Width="160"/>
   <Column ss:Width="120"/>
   <Column ss:Width="200"/>
   <Column ss:Width="100"/>
   <Column ss:Width="130"/>
   <Column ss:Width="130"/>
   <Column ss:Width="110"/>
   <Row ss:Height="22">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Order ID</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Date &amp; Time</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Customer Name</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Phone</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Email</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">City</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Delivery Address</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Total Amount (₹)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Payment Method</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Payment Status</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Fulfillment Status</Data></Cell>
   </Row>
`;

  orders.forEach((o) => {
    const cust = o.customer || {};
    const itemsSummary = Array.isArray(o.items)
      ? o.items.map(it => `${it.name} (x${it.quantity || 1})`).join('; ')
      : '';
    xml += `   <Row>
    <Cell ss:StyleID="BoldCell"><Data ss:Type="String">${escapeXml(o.id)}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(o.date || '')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(cust.name || 'Valued Customer')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(cust.phone || '—')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(cust.email || '—')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(cust.city || 'Chennai')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(cust.address || 'Showroom Counter Handover')}</Data></Cell>
    <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">${Number(o.total) || 0}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(o.paymentMethod || 'UPI / Counter')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(o.paymentStatus || 'Paid')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(o.status || 'Delivered')}</Data></Cell>
   </Row>
`;
  });

  xml += `  </Table>
 </Worksheet>
`;

  // ----------------------------------------------------
  // SHEET 3: PRODUCTS CATALOG & INVENTORY
  // ----------------------------------------------------
  xml += ` <Worksheet ss:Name="Products Catalog">
  <Table ss:DefaultColumnWidth="120">
   <Column ss:Width="110"/>
   <Column ss:Width="200"/>
   <Column ss:Width="110"/>
   <Column ss:Width="110"/>
   <Column ss:Width="100"/>
   <Column ss:Width="100"/>
   <Column ss:Width="90"/>
   <Column ss:Width="80"/>
   <Column ss:Width="80"/>
   <Column ss:Width="110"/>
   <Row ss:Height="22">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Product ID</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Product Name</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Department</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Subcategory</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Selling Price (₹)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Original MRP (₹)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Discount %</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Stock Units</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Rating</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Promo Badge</Data></Cell>
   </Row>
`;

  activeProducts.forEach((p) => {
    xml += `   <Row>
    <Cell><Data ss:Type="String">${escapeXml(p.id)}</Data></Cell>
    <Cell ss:StyleID="BoldCell"><Data ss:Type="String">${escapeXml(p.name)}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(p.category || 'General')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(p.subcategory || '—')}</Data></Cell>
    <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">${Number(p.price) || 0}</Data></Cell>
    <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">${Number(p.originalPrice) || Number(p.price) || 0}</Data></Cell>
    <Cell ss:StyleID="NumberCell"><Data ss:Type="Number">${Number(p.discount) || 0}</Data></Cell>
    <Cell ss:StyleID="NumberCell"><Data ss:Type="Number">${Number(p.stock) || 10}</Data></Cell>
    <Cell ss:StyleID="CenterCell"><Data ss:Type="String">${escapeXml(p.rating || '4.8')} ★</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(p.badge || '—')}</Data></Cell>
   </Row>
`;
  });

  xml += `  </Table>
 </Worksheet>
`;

  // ----------------------------------------------------
  // SHEET 4: CUSTOMERS DIRECTORY
  // ----------------------------------------------------
  xml += ` <Worksheet ss:Name="Customers Directory">
  <Table ss:DefaultColumnWidth="130">
   <Column ss:Width="140"/>
   <Column ss:Width="110"/>
   <Column ss:Width="160"/>
   <Column ss:Width="110"/>
   <Column ss:Width="200"/>
   <Column ss:Width="90"/>
   <Column ss:Width="120"/>
   <Column ss:Width="110"/>
   <Column ss:Width="130"/>
   <Row ss:Height="22">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Customer Name</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Phone Number</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Email Address</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">City</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Address</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Orders Count</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Lifetime Spend (₹)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Last Order ID</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Last Order Date</Data></Cell>
   </Row>
`;

  customerList.forEach((c) => {
    xml += `   <Row>
    <Cell ss:StyleID="BoldCell"><Data ss:Type="String">${escapeXml(c.name || 'Store Customer')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(c.phone || '—')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(c.email || '—')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(c.city || 'Chennai')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(c.address || '—')}</Data></Cell>
    <Cell ss:StyleID="NumberCell"><Data ss:Type="Number">${Number(c.orderCount) || 1}</Data></Cell>
    <Cell ss:StyleID="CurrencyCell"><Data ss:Type="Number">${Number(c.totalSpent) || 0}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(c.lastOrderId || '—')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(c.lastOrder || c.lastOrderDate || 'Recent')}</Data></Cell>
   </Row>
`;
  });

  xml += `  </Table>
 </Worksheet>
</Workbook>`;

  // Trigger Download
  const filename = `Sardar_Mart_Complete_Store_Report_${Date.now()}.xls`;
  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return { success: true, filename };
}

/**
 * 2. EXPORT TO CSV SPREADSHEET (.CSV)
 */
export function exportToCSV({
  orders = [],
  activeProducts = [],
  customerList = [],
  stats = {}
}) {
  const rows = [];
  rows.push(['SARDAR MART FURNITURE & HOME APPLIANCES - MASTER DATA REPORT']);
  rows.push(['Generated Date', new Date().toLocaleString('en-IN')]);
  rows.push(['GSTIN', '33DVKPR2334L1Z9']);
  rows.push([]);

  // Orders Section
  rows.push(['--- ORDERS & SALES TRANSACTIONS ---']);
  rows.push(['Order ID', 'Date', 'Customer Name', 'Phone', 'Email', 'City', 'Delivery Address', 'Total (INR)', 'Payment Method', 'Payment Status', 'Order Status']);
  orders.forEach(o => {
    const cust = o.customer || {};
    rows.push([
      o.id,
      o.date,
      cust.name || 'Customer',
      cust.phone || '',
      cust.email || '',
      cust.city || 'Chennai',
      cust.address || '',
      o.total || 0,
      o.paymentMethod || 'UPI',
      o.paymentStatus || 'Paid',
      o.status || 'Delivered'
    ]);
  });

  rows.push([]);
  rows.push(['--- CATALOG INVENTORY & PRODUCTS ---']);
  rows.push(['Product ID', 'Name', 'Department', 'Subcategory', 'Price (INR)', 'Stock', 'Rating', 'Badge']);
  activeProducts.forEach(p => {
    rows.push([
      p.id,
      p.name,
      p.category,
      p.subcategory || '',
      p.price,
      p.stock || 10,
      p.rating || 4.8,
      p.badge || ''
    ]);
  });

  rows.push([]);
  rows.push(['--- REGISTERED CUSTOMERS DIRECTORY ---']);
  rows.push(['Customer Name', 'Phone', 'Email', 'City', 'Total Orders', 'Lifetime Spend (INR)', 'Last Order Date']);
  customerList.forEach(c => {
    rows.push([
      c.name,
      c.phone,
      c.email,
      c.city,
      c.orderCount || 1,
      c.totalSpent || 0,
      c.lastOrder || ''
    ]);
  });

  const filename = `Sardar_Mart_Store_Data_${Date.now()}.csv`;
  const csvContent = '\uFEFF' + rows.map(r => r.map(escapeCSV).join(',')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return { success: true, filename };
}

/**
 * 3. EXPORT TO OFFICIAL EXECUTIVE PDF REPORT (.PDF)
 * Formats high-resolution A4 document with letterhead, tables, charts, stamps & invokes window.print()
 */
export function exportToPDF({
  activeProducts = [],
  orders = [],
  customerList = [],
  reviews = [],
  stats = {},
  storeSettings = {}
}) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const totalRevenue = stats.totalRevenue || orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalInventoryValue = stats.totalInventoryValue || activeProducts.reduce((sum, p) => sum + ((Number(p.price) || 0) * (Number(p.stock) || 10)), 0);

  const furnitureCount = activeProducts.filter(p => p.category === 'furniture').length;
  const electronicsCount = activeProducts.filter(p => p.category === 'electronics').length;
  const appliancesCount = activeProducts.filter(p => p.category === 'appliances').length;

  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const processingCount = orders.filter(o => o.status === 'Processing' || o.status === 'Order Placed').length;

  const printWindow = window.open('', '_blank', 'width=1050,height=900');
  if (!printWindow) {
    alert('Please allow popups for localhost to view and download the PDF report.');
    return { success: false, reason: 'popup_blocked' };
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sardar Mart - Executive Store Analytics &amp; Inventory Report</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.45;
      font-size: 11pt;
    }
    .report-container {
      max-width: 100%;
      margin: 0 auto;
    }

    /* Official Letterhead */
    .report-header {
      border-bottom: 2.5px solid #8c3b10;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-group h1 {
      font-size: 22pt;
      font-weight: 800;
      color: #8c3b10;
      letter-spacing: -0.5px;
      margin-bottom: 2px;
    }
    .brand-group h1 span {
      color: #d97706;
    }
    .brand-sub {
      font-size: 8.5pt;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .brand-address {
      font-size: 8.5pt;
      color: #475569;
      line-height: 1.35;
    }
    .meta-box {
      text-align: right;
      background: #fdf8f4;
      border: 1px solid #fed7aa;
      padding: 8px 12px;
      border-radius: 6px;
    }
    .meta-title {
      font-size: 11pt;
      font-weight: 800;
      color: #9a3412;
      text-transform: uppercase;
    }
    .meta-date {
      font-size: 8.5pt;
      color: #78350f;
      margin-top: 2px;
    }
    .gstin-pill {
      display: inline-block;
      margin-top: 4px;
      font-size: 8pt;
      font-weight: 700;
      background: #8c3b10;
      color: #ffffff;
      padding: 2px 6px;
      border-radius: 4px;
    }

    /* Executive KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 18px;
    }
    .kpi-card {
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
      background: #f8fafc;
    }
    .kpi-card.highlight {
      border-color: #f59e0b;
      background: #fffbeb;
    }
    .kpi-label {
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.5px;
    }
    .kpi-value {
      font-size: 15pt;
      font-weight: 800;
      color: #0f172a;
      margin: 4px 0 2px;
    }
    .kpi-card.highlight .kpi-value {
      color: #b45309;
    }
    .kpi-sub {
      font-size: 7.5pt;
      color: #15803d;
      font-weight: 700;
    }

    /* Section Headings */
    .section-title {
      font-size: 11pt;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 4px;
      margin: 14px 0 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-count {
      font-size: 8.5pt;
      color: #64748b;
      font-weight: 600;
    }

    /* Two Column Summary */
    .two-col-summary {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 16px;
    }
    .summary-box {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 12px;
    }
    .summary-box h4 {
      font-size: 9pt;
      font-weight: 700;
      color: #334155;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      padding: 3px 0;
      border-bottom: 1px dotted #e2e8f0;
    }
    .stat-row:last-child {
      border-bottom: none;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 8.5pt;
    }
    th {
      background: #2a1810;
      color: #ffffff;
      text-align: left;
      padding: 6px 8px;
      font-weight: 700;
      font-size: 8pt;
      text-transform: uppercase;
    }
    td {
      padding: 5px 8px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    tr:nth-child(even) td {
      background: #fafaf9;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .pill {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
    }
    .pill.paid { background: #dcfce7; color: #15803d; }
    .pill.delivered { background: #dbeafe; color: #1e40af; }

    /* Footer & Signatures */
    .report-footer {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1.5px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 8pt;
      color: #64748b;
    }
    .seal-box {
      border: 1.5px dashed #94a3b8;
      border-radius: 6px;
      padding: 10px 18px;
      text-align: center;
      width: 220px;
    }
    .seal-title {
      font-weight: 700;
      color: #0f172a;
      margin-top: 18px;
    }

    /* Print Controls */
    .print-bar {
      background: #0f172a;
      color: #ffffff;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      border-radius: 6px;
    }
    .print-btn {
      background: #d97706;
      color: #ffffff;
      border: none;
      padding: 6px 14px;
      font-size: 9pt;
      font-weight: 700;
      border-radius: 4px;
      cursor: pointer;
    }
    @media print {
      .print-bar {
        display: none !important;
      }
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>

  <div class="print-bar">
    <span>Official Store Report • Ready for Print / Save as PDF</span>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="report-container">
    
    <!-- Letterhead -->
    <div class="report-header">
      <div class="brand-group">
        <h1>SARDAR <span>MART</span></h1>
        <div class="brand-sub">FURNITURE AND HOME APPLIANCES • CHENNAI</div>
        <div class="brand-address">
          No. 192, E.H Road, Cholan Nagar, Vyasarpadi, Erukancheri, Chennai - 600039.<br>
          Direct Helplines: +91 6383056338 • +91 9344623632 • Email: sardarmart64@gmail.com
        </div>
      </div>
      <div class="meta-box">
        <div class="meta-title">Executive Analytics Report</div>
        <div class="meta-date">Date: ${escapeXml(dateStr)} • ${escapeXml(timeStr)}</div>
        <div class="gstin-pill">GSTIN: 33DVKPR2334L1Z9</div>
      </div>
    </div>

    <!-- Executive KPI Grid -->
    <div class="kpi-grid">
      <div class="kpi-card highlight">
        <div class="kpi-label">Total Realized Revenue</div>
        <div class="kpi-value">${escapeXml(formatINR(totalRevenue))}</div>
        <div class="kpi-sub">Across All Customer Invoices</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Inventory Valuation</div>
        <div class="kpi-value">${escapeXml(formatINR(totalInventoryValue))}</div>
        <div class="kpi-sub">Catalog Live Asset Value</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Completed Orders</div>
        <div class="kpi-value">${orders.length} Orders</div>
        <div class="kpi-sub">${deliveredCount} Handed Over</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Catalog Products SKU</div>
        <div class="kpi-value">${activeProducts.length} Models</div>
        <div class="kpi-sub">Active &amp; Stocked</div>
      </div>
    </div>

    <!-- Department & Order Status Summary -->
    <div class="two-col-summary">
      <div class="summary-box">
        <h4>Department Inventory Breakdown</h4>
        <div class="stat-row">
          <span>Living &amp; Bedroom Furniture</span>
          <strong>${furnitureCount} items (${Math.round((furnitureCount / Math.max(activeProducts.length, 1)) * 100)}%)</strong>
        </div>
        <div class="stat-row">
          <span>Smart 4K TVs &amp; Electronics</span>
          <strong>${electronicsCount} items (${Math.round((electronicsCount / Math.max(activeProducts.length, 1)) * 100)}%)</strong>
        </div>
        <div class="stat-row">
          <span>Refrigerators &amp; Home Appliances</span>
          <strong>${appliancesCount} items (${Math.round((appliancesCount / Math.max(activeProducts.length, 1)) * 100)}%)</strong>
        </div>
      </div>

      <div class="summary-box">
        <h4>Order Fulfillment &amp; Customers</h4>
        <div class="stat-row">
          <span>Delivered / Handed Over</span>
          <strong style="color: #15803d;">${deliveredCount} Orders</strong>
        </div>
        <div class="stat-row">
          <span>Processing / In Transit</span>
          <strong style="color: #b45309;">${processingCount} Orders</strong>
        </div>
        <div class="stat-row">
          <span>Registered Showroom Customers</span>
          <strong>${customerList.length} Clients</strong>
        </div>
      </div>
    </div>

    <!-- Section 1: Recent Orders & Sales Transactions -->
    <div class="section-title">
      <span>Recent Orders &amp; Sales Transactions</span>
      <span class="section-count">${orders.length} Total Recorded Orders</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Date</th>
          <th>Customer Name</th>
          <th>Phone</th>
          <th>City</th>
          <th>Payment Method</th>
          <th>Status</th>
          <th class="text-right">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        ${orders.slice(0, 15).map(o => `
          <tr>
            <td><strong>${escapeXml(o.id)}</strong></td>
            <td>${escapeXml(o.date?.split(',')[0] || '')}</td>
            <td>${escapeXml(o.customer?.name || 'Customer')}</td>
            <td>${escapeXml(o.customer?.phone || '—')}</td>
            <td>${escapeXml(o.customer?.city || 'Chennai')}</td>
            <td>${escapeXml(o.paymentMethod || 'UPI / Counter')}</td>
            <td><span class="pill delivered">${escapeXml(o.status || 'Delivered')}</span></td>
            <td class="text-right"><strong>${escapeXml(formatINR(o.total))}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Section 2: Showroom Valued Customers -->
    <div class="section-title">
      <span>Top Registered Showroom Customers</span>
      <span class="section-count">${customerList.length} Total Customers</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>Phone</th>
          <th>City</th>
          <th>Orders Count</th>
          <th>Last Order Date</th>
          <th class="text-right">Lifetime Spend</th>
        </tr>
      </thead>
      <tbody>
        ${customerList.slice(0, 8).map(c => `
          <tr>
            <td><strong>${escapeXml(c.name)}</strong></td>
            <td>${escapeXml(c.phone)}</td>
            <td>${escapeXml(c.city || 'Chennai')}</td>
            <td>${escapeXml(c.orderCount || 1)} Order(s)</td>
            <td>${escapeXml(c.lastOrder || 'Recent')}</td>
            <td class="text-right"><strong>${escapeXml(formatINR(c.totalSpent))}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Footer Stamp -->
    <div class="report-footer">
      <div>
        <p><strong>Sardar Mart Furniture and Home Appliances</strong> • Confidential Executive Business Record</p>
        <p>Generated automatically via Cloud Firestore ERP • Engineered by DM Digital Labs</p>
      </div>
      <div class="seal-box">
        <div class="seal-title">Authorized Showroom Signatory</div>
      </div>
    </div>

  </div>

  <script>
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        window.print();
      }, 400);
    });
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  return { success: true };
}
