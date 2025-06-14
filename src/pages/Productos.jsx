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
      // Intentar obtener desde localStorage
      const productosLS = localStorage.getItem('productos');
      if (productosLS) {
        setProductos(JSON.parse(productosLS));
      } else {
        // Si no hay localStorage, carga desde función externa
        const lista = await obtenerProductos();
        setProductos(lista);
        // Guardar en localStorage para persistencia
        localStorage.setItem('productos', JSON.stringify(lista));
      }

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
      // Actualizar productos en estado y localStorage
      const actualizados = productos.map((p) =>
        p.id === editId ? { ...p, ...productoData } : p
      );
      setProductos(actualizados);
      localStorage.setItem('productos', JSON.stringify(actualizados));
    } else {
      const nuevo = await agregarProducto(productoData);
      const nuevosProductos = [...productos, nuevo];
      setProductos(nuevosProductos);
      localStorage.setItem('productos', JSON.stringify(nuevosProductos));
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
      const actualizados = productos.filter((p) => p.id !== id);
      setProductos(actualizados);
      localStorage.setItem('productos', JSON.stringify(actualizados));
      if (editId === id) resetForm();
    }
  };

  // Descargar backup productos en JSON
  const descargarBackup = () => {
    const json = JSON.stringify(productos, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup_productos.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importar backup desde archivo JSON
  const importarProductos = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const productosImportados = JSON.parse(e.target.result);

        if (!Array.isArray(productosImportados)) {
          alert('El archivo debe contener un arreglo de productos');
          return;
        }

        const esValido = productosImportados.every(
          (p) =>
            p.codigo && typeof p.codigo === 'string' &&
            p.nombre && typeof p.nombre === 'string' &&
            typeof p.precio === 'number'
        );
        if (!esValido) {
          alert('Algunos productos tienen datos inválidos');
          return;
        }

        // Guardar en localStorage y actualizar estado
        localStorage.setItem('productos', JSON.stringify(productosImportados));
        setProductos(productosImportados);

        alert('Backup cargado correctamente');
      } catch (error) {
        alert('Error leyendo el archivo. Asegúrate que sea un JSON válido');
      }
    };
    reader.readAsText(file);

    // Limpiar input para poder cargar mismo archivo si se desea
    event.target.value = null;
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

      {/* Botones para backup y restauración */}
      <div className="mt-6 max-w-md flex items-center space-x-4">
        <button
          onClick={descargarBackup}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Descargar Backup
        </button>

        <input
          type="file"
          accept="application/json"
          onChange={importarProductos}
          className="border px-2 py-1"
        />
      </div>
    </div>
  );
}
