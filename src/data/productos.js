const STORAGE_KEY = 'productos';

export const obtenerProductos = async () => {
  const datos = localStorage.getItem(STORAGE_KEY);
  return datos ? JSON.parse(datos) : [];
};

export const guardarProductos = async (productos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
};

export const agregarProducto = async (producto) => {
  const productos = await obtenerProductos();
  const nuevo = { ...producto, id: Date.now().toString() };
  const actualizados = [...productos, nuevo];
  await guardarProductos(actualizados);
  return nuevo;
};

export const actualizarProducto = async (id, datosActualizados) => {
  const productos = await obtenerProductos();
  const actualizados = productos.map((p) =>
    p.id === id ? { ...p, ...datosActualizados } : p
  );
  await guardarProductos(actualizados);
};

export const eliminarProducto = async (id) => {
  const productos = await obtenerProductos();
  const actualizados = productos.filter((p) => p.id !== id);
  await guardarProductos(actualizados);
};
