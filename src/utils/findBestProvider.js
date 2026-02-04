import { calcularValores } from './calculations';

/**
 * Encuentra el proveedor más conveniente basado en el costo final más bajo
 * @param {Object} item - El item del producto con sus proveedores
 * @param {number} ivaRate - Tasa de IVA
 * @returns {Object|null} - El proveedor más conveniente con sus cálculos, o null si no hay proveedores válidos
 */
export const findBestProvider = (item, ivaRate) => {
  if (!item.proveedores || item.proveedores.length === 0) {
    return null;
  }

  let bestProvider = null;
  let minCostoFinal = Infinity;

  item.proveedores.forEach(provider => {
    if (provider.costo > 0) {
      const calculos = calcularValores(
        provider.costo,
        provider.aplicaIva,
        provider.margen,
        item.cantidad,
        ivaRate
      );

      if (calculos.costoMasIva < minCostoFinal) {
        minCostoFinal = calculos.costoMasIva;
        bestProvider = {
          ...provider,
          productoNombre: item.nombre,
          productoId: item.id,
          cantidad: item.cantidad,
          calculos: calculos,
          ivaRate: ivaRate
        };
      }
    }
  });

  return bestProvider;
};
