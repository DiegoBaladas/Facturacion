const STORAGE_KEY = "facturas";

// Leer todas las facturas
export const obtenerFacturas = async () => {
  const json = localStorage.getItem(STORAGE_KEY);
  const facturas = json ? JSON.parse(json) : [];
  return facturas;
};

// Crear una factura nueva
export const crearFactura = async (factura) => {
  const facturas = await obtenerFacturas();
  const nuevaFactura = {
    id: crypto.randomUUID(), // genera un ID único
    ...factura,
  };
  facturas.push(nuevaFactura);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(facturas));
  return nuevaFactura;
};

// Actualizar factura por ID
export const actualizarFactura = async (id, facturaActualizada) => {
  const facturas = await obtenerFacturas();
  const index = facturas.findIndex(f => f.id === id);
  if (index !== -1) {
    facturas[index] = { ...facturas[index], ...facturaActualizada };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(facturas));
  }
};

// Eliminar factura por ID
export const eliminarFactura = async (id) => {
  const facturas = await obtenerFacturas();
  const nuevasFacturas = facturas.filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevasFacturas));
};

// Buscar factura por código
export const buscarFacturaPorCodigo = async (codigo) => {
  const facturas = await obtenerFacturas();
  return facturas.filter(f => f.codigo === codigo);
};
