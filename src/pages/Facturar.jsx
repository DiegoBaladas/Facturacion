import { useState, useEffect } from 'react';
import { obtenerFacturas, crearFactura, eliminarFactura } from '../data/facturas';
import { obtenerClientes } from '../firebase/clientes';
import { obtenerProductos } from '../data/productos';

export default function Facturar() {
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [clienteId, setClienteId] = useState('');
  const [items, setItems] = useState([{ productoId: '', cantidad: 1 }]);
  const [busquedas, setBusquedas] = useState(['']); // para el input de búsqueda de cada item
  const [editId, setEditId] = useState(null);
  const [aplicarIVA, setAplicarIVA] = useState(false);

  useEffect(() => {
    obtenerFacturas().then(setFacturas);
    obtenerClientes().then(setClientes);
    obtenerProductos().then(setProductos);
  }, []);

  const resetForm = () => {
    setClienteId('');
    setItems([{ productoId: '', cantidad: 1 }]);
    setBusquedas(['']);
    setEditId(null);
    setAplicarIVA(false);
  };

  const handleAddItem = () => {
    setItems([...items, { productoId: '', cantidad: 1 }]);
    setBusquedas([...busquedas, '']);
  };

  const handleItemChange = (index, field, value) => {
    const nuevosItems = [...items];
    if (field === 'cantidad') {
      nuevosItems[index][field] = Number(value);
    } else {
      nuevosItems[index][field] = value;
    }
    setItems(nuevosItems);
  };

  const handleBusquedaChange = (index, valor) => {
    const nuevasBusquedas = [...busquedas];
    nuevasBusquedas[index] = valor;
    setBusquedas(nuevasBusquedas);

    // Cuando el usuario borra el texto, limpiar el producto seleccionado también
    if (!valor) {
      handleItemChange(index, 'productoId', '');
    }
  };

  const handleRemoveItem = (index) => {
    const nuevosItems = items.filter((_, i) => i !== index);
    const nuevasBusquedas = busquedas.filter((_, i) => i !== index);
    setItems(nuevosItems.length ? nuevosItems : [{ productoId: '', cantidad: 1 }]);
    setBusquedas(nuevasBusquedas.length ? nuevasBusquedas : ['']);
  };

  const calcularSubtotal = () => {
    return items.reduce((total, item) => {
      const prod = productos.find(p => p.id === item.productoId);
      if (!prod) return total;
      const precioBase = aplicarIVA ? prod.precio * 1.22 : prod.precio;
      return total + precioBase * item.cantidad;
    }, 0);
  };

  const subtotal = calcularSubtotal();
  const IVA = aplicarIVA ? subtotal * 0.22 / 1.22 : 0; // IVA aplicado solo si está marcado
  const total = subtotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteId) {
      alert('Elegí un cliente');
      return;
    }
    if (items.some(item => !item.productoId || item.cantidad <= 0)) {
      alert('Completa todos los productos y cantidades correctamente');
      return;
    }

    const factura = {
      clienteId,
      items,
      fecha: new Date().toISOString(),
      subtotal,
      iva: IVA,
      total,
      aplicarIVA,
    };

    if (editId) factura.id = editId;

    await crearFactura(factura);
    const nuevasFacturas = await obtenerFacturas();
    setFacturas(nuevasFacturas);
    resetForm();
  };

  const handleEditar = (factura) => {
    setClienteId(factura.clienteId);
    setItems(factura.items);
    setBusquedas(factura.items.map(item => {
      const prod = productos.find(p => p.id === item.productoId);
      return prod ? prod.codigo : '';
    }));
    setEditId(factura.id);
    setAplicarIVA(factura.aplicarIVA || false);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que querés eliminar esta factura?')) {
      await eliminarFactura(id);
      const nuevasFacturas = await obtenerFacturas();
      setFacturas(nuevasFacturas);
    }
  };

  const nombreCliente = (id) => {
    const c = clientes.find(cl => cl.id === id);
    return c ? c.nombre : '';
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Facturar</h2>

      <form onSubmit={handleSubmit} className="mb-6 max-w-lg space-y-2 border p-4 rounded shadow-sm">
        <label>
          Cliente:
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="border px-2 py-1 w-full mb-2"
          >
            <option value="">-- Seleccioná un cliente --</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            checked={aplicarIVA}
            onChange={e => setAplicarIVA(e.target.checked)}
          />
          <span>Aplicar IVA (22%)</span>
        </label>

        {items.map((item, index) => {
          const busquedaActual = busquedas[index]?.toLowerCase() || '';
          const opcionesFiltradas = productos.filter(p =>
            p.codigo.toLowerCase().includes(busquedaActual) ||
            p.nombre.toLowerCase().includes(busquedaActual)
          );

          const productoSeleccionado = productos.find(p => p.id === item.productoId);

          return (
            <div key={index} className="mb-4 relative">
              <input
                type="text"
                placeholder="Buscar producto por código o nombre"
                value={busquedas[index]}
                onChange={e => handleBusquedaChange(index, e.target.value)}
                className="border px-2 py-1 w-full"
                autoComplete="off"
              />

              {busquedas[index] && opcionesFiltradas.length > 0 && (
                <ul className="border rounded max-h-40 overflow-auto bg-white absolute z-10 w-full">
                  {opcionesFiltradas.map(p => (
                    <li
                      key={p.id}
                      onClick={() => {
                        handleItemChange(index, 'productoId', p.id);
                        const nuevasBusquedas = [...busquedas];
                        nuevasBusquedas[index] = p.codigo;
                        setBusquedas(nuevasBusquedas);
                      }}
                      className="cursor-pointer px-2 py-1 hover:bg-blue-200"
                    >
                      {p.codigo} - {p.nombre} - ${p.precio.toFixed(2)}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center mt-1 gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.cantidad}
                  onChange={e => handleItemChange(index, 'cantidad', e.target.value)}
                  className="border px-2 py-1 w-20"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  X
                </button>
                {productoSeleccionado && (
                  <p className="text-sm text-gray-600 ml-2">
                    Precio unitario: ${productoSeleccionado.precio.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={handleAddItem}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        >
          Agregar producto
        </button>

        <div className="border-t pt-2">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>IVA (22%): ${IVA.toFixed(2)}</p>
          <p className="font-bold">Total: ${total.toFixed(2)}</p>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? 'Actualizar Factura' : 'Guardar Factura'}
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

      <table className="w-full border-collapse border border-gray-300 max-w-4xl">
        <thead>
          <tr>
            <th className="border border-gray-300 px-2 py-1">Cliente</th>
            <th className="border border-gray-300 px-2 py-1">Fecha</th>
            <th className="border border-gray-300 px-2 py-1">Total</th>
            <th className="border border-gray-300 px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map(f => (
            <tr key={f.id}>
              <td className="border border-gray-300 px-2 py-1">{nombreCliente(f.clienteId)}</td>
              <td className="border border-gray-300 px-2 py-1">{new Date(f.fecha).toLocaleDateString()}</td>
              <td className="border border-gray-300 px-2 py-1">${f.total.toFixed(2)}</td>
              <td className="border border-gray-300 px-2 py-1 space-x-2">
                <button
                  onClick={() => handleEditar(f)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(f.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
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
