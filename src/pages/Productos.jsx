import { useState, useEffect } from 'react';
import {
  obtenerProductos,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
} from '../data/productos';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [editId, setEditId] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // Carga productos y draft de localStorage
  useEffect(() => {
    const cargar = async () => {
      const lista = await obtenerProductos();
      setProductos(lista);

      const draft = localStorage.getItem('productoDraft');
      if (draft) {
        const { codigo, nombre, precio } = JSON.parse(draft);
        setCodigo(codigo);
        setNombre(nombre);
        setPrecio(precio);
      }
    };
    cargar();
  }, []);

  // Guarda draft al cambiar inputs
  useEffect(() => {
    localStorage.setItem(
      'productoDraft',
      JSON.stringify({ codigo, nombre, precio })
    );
  }, [codigo, nombre, precio]);

  const resetForm = () => {
    setCodigo('');
    setNombre('');
    setPrecio('');
    setEditId(null);
    localStorage.removeItem('productoDraft');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!codigo || !nombre || !precio) {
      alert('Por favor completa todos los campos');
      return;
    }

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum)) {
      alert('Precio inválido');
      return;
    }

    const codigoExiste = productos.some(
      (p) => p.codigo === codigo && p.id !== editId
    );
    if (codigoExiste) {
      alert('El código de producto ya existe');
      return;
    }

    const productoData = {
      codigo,
      nombre,
      precio: precioNum,
    };

    if (editId) {
      await actualizarProducto(editId, productoData);
      const actualizados = await obtenerProductos();
      setProductos(actualizados);
    } else {
      const nuevo = await agregarProducto(productoData);
      setProductos([...productos, nuevo]);
    }

    resetForm();
  };

  const handleEditar = (producto) => {
    setCodigo(producto.codigo);
    setNombre(producto.nombre);
    setPrecio(producto.precio.toString());
    setEditId(producto.id);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('Deseas eliminar este producto?')) {
      await eliminarProducto(id);
      const actualizados = await obtenerProductos();
      setProductos(actualizados);
      if (editId === id) resetForm();
    }
  };

  // Filtra productos según búsqueda (por código o nombre)
  const productosFiltrados = productos.filter((producto) => {
    const texto = busqueda.toLowerCase();
    return (
      producto.codigo.toLowerCase().includes(texto) ||
      producto.nombre.toLowerCase().includes(texto)
    );
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Productos</h2>

      <div className="mb-4 max-w-md">
        <input
          type="text"
          placeholder="Buscar por código o nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2 max-w-md">
        <input
          type="text"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="border px-2 py-1 w-full"
        />
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border px-2 py-1 w-full"
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="border px-2 py-1 w-full"
          step="0.01"
          min="0"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? 'Actualizar' : 'Agregar'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-2 px-4 py-2 border rounded"
          >
            Cancelar
          </button>
        )}
      </form>

      <table className="w-full border-collapse border border-gray-300 max-w-lg">
        <thead>
          <tr>
            <th className="border border-gray-300 px-2 py-1">Código</th>
            <th className="border border-gray-300 px-2 py-1">Nombre</th>
            <th className="border border-gray-300 px-2 py-1">Precio</th>
            <th className="border border-gray-300 px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4">No hay productos</td>
            </tr>
          )}
          {productosFiltrados.map((producto) => (
            <tr key={producto.id}>
              <td className="border border-gray-300 px-2 py-1">{producto.codigo}</td>
              <td className="border border-gray-300 px-2 py-1">{producto.nombre}</td>
              <td className="border border-gray-300 px-2 py-1">${producto.precio.toFixed(2)}</td>
              <td className="border border-gray-300 px-2 py-1 space-x-2">
                <button
                  onClick={() => handleEditar(producto)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(producto.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// src/pages/Productos.jsx
// src/pages/Productos.jsx