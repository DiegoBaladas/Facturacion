const STORAGE_KEY = 'productos';

export function obtenerProductos() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function guardarProductos(productos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
}
