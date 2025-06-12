import { useState, useEffect } from 'react';
import { obtenerFacturas } from '../data/facturas'; // <-- Cambio acá

export default function HistorialFacturas() {
  const [facturas, setFacturas] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  useEffect(() => {
    const fetchFacturas = async () => {
      const data = await obtenerFacturas();
      setFacturas(data);
    };
    fetchFacturas();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Historial de Facturas</h2>

      {!facturaSeleccionada && (
        <>
          {facturas.length === 0 ? (
            <p>No hay facturas guardadas.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 max-w-lg">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-2 py-1">ID</th>
                  <th className="border border-gray-300 px-2 py-1">Fecha</th>
                  <th className="border border-gray-300 px-2 py-1">Total</th>
                  <th className="border border-gray-300 px-2 py-1">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((factura) => (
                  <tr key={factura.id}>
                    <td className="border border-gray-300 px-2 py-1">{factura.id}</td>
                    <td className="border border-gray-300 px-2 py-1">
                      {factura.fecha ? new Date(factura.fecha).toLocaleString() : 'Sin fecha'}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      ${factura.total?.toFixed(2) || 0}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded"
                        onClick={() => setFacturaSeleccionada(factura)}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {facturaSeleccionada && (
        <div className="max-w-lg">
          <button
            onClick={() => setFacturaSeleccionada(null)}
            className="mb-2 px-4 py-2 border rounded"
          >
            Volver al listado
          </button>

          <h3 className="text-lg font-semibold mb-2">Detalle de factura</h3>

          <p><strong>ID:</strong> {facturaSeleccionada.id}</p>
          <p><strong>Fecha:</strong> {new Date(facturaSeleccionada.fecha).toLocaleString()}</p>
          <table className="w-full border-collapse border border-gray-300 my-2">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 py-1">Código</th>
                <th className="border border-gray-300 px-2 py-1">Nombre</th>
                <th className="border border-gray-300 px-2 py-1">Cantidad</th>
                <th className="border border-gray-300 px-2 py-1">Precio Unit.</th>
                <th className="border border-gray-300 px-2 py-1">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {facturaSeleccionada.items?.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-2 py-1">{item.codigo || '-'}</td>
                  <td className="border border-gray-300 px-2 py-1">{item.nombre}</td>
                  <td className="border border-gray-300 px-2 py-1">{item.cantidad}</td>
                  <td className="border border-gray-300 px-2 py-1">${item.precio.toFixed(2)}</td>
                  <td className="border border-gray-300 px-2 py-1">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="font-bold text-right">
            Total: ${facturaSeleccionada.total?.toFixed(2) || 0}
          </p>
        </div>
      )}
    </div>
  );
}
// This code defines a React component for displaying the history of invoices.
// It fetches the invoices from a Firebase database and displays them in a table. 