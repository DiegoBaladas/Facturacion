import { useState, useEffect } from 'react';
import {
  obtenerClientes,
  guardarCliente,
  eliminarCliente,
} from '../firebase/clientes';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    obtenerClientes().then(setClientes);
  }, []);

  const resetForm = () => {
    setNombre('');
    setEmail('');
    setTelefono('');
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !email || !telefono) {
      alert('Completá todos los campos');
      return;
    }

    const cliente = { nombre, email, telefono };
    if (editId) cliente.id = editId;

    await guardarCliente(cliente);
    const nuevosClientes = await obtenerClientes();
    setClientes(nuevosClientes);
    resetForm();
  };

  const handleEditar = (cliente) => {
    setNombre(cliente.nombre);
    setEmail(cliente.email);
    setTelefono(cliente.telefono);
    setEditId(cliente.id);
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Seguro que querés eliminar este cliente?')) {
      await eliminarCliente(id);
      const nuevosClientes = await obtenerClientes();
      setClientes(nuevosClientes);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Clientes</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2 max-w-md">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border px-2 py-1 w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-2 py-1 w-full"
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="border px-2 py-1 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
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
            <th className="border border-gray-300 px-2 py-1">Nombre</th>
            <th className="border border-gray-300 px-2 py-1">Email</th>
            <th className="border border-gray-300 px-2 py-1">Teléfono</th>
            <th className="border border-gray-300 px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No hay clientes
              </td>
            </tr>
          )}
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td className="border border-gray-300 px-2 py-1">{cliente.nombre}</td>
              <td className="border border-gray-300 px-2 py-1">{cliente.email}</td>
              <td className="border border-gray-300 px-2 py-1">{cliente.telefono}</td>
              <td className="border border-gray-300 px-2 py-1 space-x-2">
                <button
                  onClick={() => handleEditar(cliente)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(cliente.id)}
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
