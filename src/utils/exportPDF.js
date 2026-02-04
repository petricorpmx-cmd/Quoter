import { calcularValores } from './calculations';

export const handleExportPDF = (items, ivaRate) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Reporte de Comparativa</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #eee; padding: 12px; text-align: left; }
          th { background-color: #f8fafc; font-size: 11px; text-transform: uppercase; color: #64748b; }
          .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Análisis de Proveedores</h1>
          <p>Generado el ${new Date().toLocaleString()} | Tasa IVA: ${ivaRate}%</p>
        </div>
        ${items.map(item => `
          <div style="margin-bottom: 40px;">
            <h2 style="color: #1e293b;">${item.nombre || 'Producto sin nombre'} (Cant: ${item.cantidad})</h2>
            <table>
              <thead>
                <tr>
                  <th>Proveedor</th>
                  <th>Costo Base</th>
                  <th>Costo + IVA</th>
                  <th>PVP Sugerido</th>
                  <th>Ganancia Proyectada</th>
                </tr>
              </thead>
              <tbody>
                ${item.proveedores.map(p => {
                  const c = calcularValores(p.costo, p.aplicaIva, p.margen, item.cantidad, ivaRate);
                  return `<tr>
                    <td>${p.nombre || 'S/N'}</td>
                    <td>$${p.costo}</td>
                    <td>$${c.costoMasIva}</td>
                    <td>$${c.precioPublico}</td>
                    <td>$${c.totalGanancia}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
};
