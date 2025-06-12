const LLAVE_FACTURAS = "facturas";

export const obtenerFacturas = () => {
  const facturas = localStorage.getItem(LLAVE_FACTURAS);
  return facturas ? JSON.parse(facturas) : [];
};

export const guardarFacturas = (facturas) => {
  localStorage.setItem(LLAVE_FACTURAS, JSON.stringify(facturas));
};
export const agregarFactura = (factura) => {
  const facturas = obtenerFacturas();
  facturas.push(factura);
  guardarFacturas(facturas);
};