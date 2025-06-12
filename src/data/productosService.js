// src/data/productosService.js

const STORAGE_KEY = "productos";

// Obtener todos los productos
export const obtenerProductos = async () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Agregar nuevo producto
export const agregarProducto = async (producto) => {
  const productos = await obtenerProductos();
  const nuevoProducto = {
    id: crypto.randomUUID(),
    ...producto,
  };
  productos.push(nuevoProducto);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
  return nuevoProducto;
};

// Actualizar producto
export const actualizarProducto = async (id, data) => {
  const productos = await obtenerProductos();
  const index = productos.findIndex((p) => p.id === id);
  if (index !== -1) {
    productos[index] = { ...productos[index], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
  }
};

// Eliminar producto
export const eliminarProducto = async (id) => {
  const productos = await obtenerProductos();
  const nuevosProductos = productos.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosProductos));
};
// Buscar producto por código
export const buscarProductoPorCodigo = async (codigo) => {
  const productos = await obtenerProductos();
  return productos.filter((p) => p.codigo === codigo);
};