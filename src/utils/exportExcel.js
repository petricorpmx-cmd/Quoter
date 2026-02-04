/**
 * Exporta los proveedores guardados a un archivo Excel
 * @param {Array} favoriteProviders - Array de proveedores favoritos
 */
export const handleExportExcel = (favoriteProviders) => {
  if (!favoriteProviders || favoriteProviders.length === 0) {
    alert('No hay proveedores guardados para exportar');
    return;
  }

  const headers = [
    'Proveedor',
    'Producto',
    'Cantidad',
    'Costo Base',
    'Costo + IVA',
    'IVA %',
    'Aplica IVA',
    'Margen %',
    'Ganancia',
    'Link',
    'Fecha Guardado'
  ];

  const rows = favoriteProviders.map(provider => {
    const fecha = provider.savedAt 
      ? new Date(provider.savedAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'N/A';

    return [
      provider.nombre || 'Sin nombre',
      provider.productoNombre || 'N/A',
      provider.cantidad || 0,
      (provider.costo || 0).toFixed(2),
      (provider.calculos?.costoMasIva || 0).toFixed(2),
      provider.ivaRate || 16,
      provider.aplicaIva ? 'Sí' : 'No',
      provider.margen || 0,
      (provider.calculos?.totalGanancia || 0).toFixed(2),
      provider.link || '',
      fecha
    ];
  });

  // Crear contenido CSV (Excel puede abrir CSV directamente)
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  // Crear BOM para Excel (UTF-8 BOM)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { 
    type: 'application/vnd.ms-excel;charset=utf-8;' 
  });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Nombre del archivo con fecha
  const fechaArchivo = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `proveedores_guardados_${fechaArchivo}.xls`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
