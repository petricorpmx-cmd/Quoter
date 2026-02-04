export const calcularValores = (costo, aplicaIva, margen, cantidad, ivaRate) => {
  const valCosto = Number(costo) || 0;
  const valMargen = Number(margen) || 0;
  const valCant = Number(cantidad) || 0;
  
  const costoMasIva = aplicaIva ? valCosto * (1 + ivaRate / 100) : valCosto;
  const precioPublico = costoMasIva * (1 + valMargen / 100);
  const gananciaUnidad = precioPublico - costoMasIva;
  const totalGanancia = gananciaUnidad * valCant;

  return {
    costoMasIva: parseFloat(costoMasIva.toFixed(2)),
    precioPublico: parseFloat(precioPublico.toFixed(2)),
    totalGanancia: parseFloat(totalGanancia.toFixed(2))
  };
};

export const prepareContextData = (items, calcularValoresWithIva) => {
  return items.map(item => ({
    producto: item.nombre,
    cantidad: item.cantidad,
    proveedores: item.proveedores.map(p => ({
      nombre: p.nombre,
      costoFinal: calcularValoresWithIva(p.costo, p.aplicaIva, p.margen, item.cantidad).costoMasIva,
      ganancia: calcularValoresWithIva(p.costo, p.aplicaIva, p.margen, item.cantidad).totalGanancia
    }))
  }));
};
