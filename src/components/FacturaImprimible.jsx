import React from 'react';

export default function FacturaImprimible({ factura }) {
  if (!factura) return null;

  return (
    <div className="p-8 text-black font-sans max-w-[800px] mx-auto print:text-black print:bg-white bg-white border border-gray-300">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mi Negocio</h1>
          <p>Dirección del negocio</p>
          <p>Tel: 123456789</p>
          <p>Email: contacto@minegocio.com</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">Factura</h2>
          <p><strong>N°:</strong> {factura.id}</p>
          <p><strong>Fecha:</strong> {new Date(factura.fecha).toLocaleString()}</p>
        </div>
      </div>

      {/* Datos del cliente */}
      {factura.cliente && (
        <div className="mb-4">
          <p><strong>Cliente:</strong> {factura.cliente}</p>
        </div>
      )}

      {/* Tabla de productos */}
      <table className="w-full border-collapse border border-gray-400 text-sm mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-400 px-2 py-1 text-left">Código</th>
            <th className="border border-gray-400 px-2 py-1 text-left">Nombre</th>
            <th className="border border-gray-400 px-2 py-1 text-center">Cantidad</th>
            <th className="border border-gray-400 px-2 py-1 text-right">Precio Unit.</th>
            <th className="border border-gray-400 px-2 py-1 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {factura.items.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-2 py-1">{item.codigo}</td>
              <td className="border border-gray-300 px-2 py-1">{item.nombre}</td>
              <td className="border border-gray-300 px-2 py-1 text-center">{item.cantidad}</td>
              <td className="border border-gray-300 px-2 py-1 text-right">${item.precio.toFixed(2)}</td>
              <td className="border border-gray-300 px-2 py-1 text-right">
                ${(item.precio * item.cantidad).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
      <div className="text-right text-lg font-bold mb-4">
        Total: ${factura.total.toFixed(2)}
      </div>

      {/* Pie */}
      <div className="text-center text-sm border-t pt-4">
        <p>Gracias por su compra</p>
        <p>Esta factura no es válida como factura fiscal</p>
      </div>
    </div>
  );
}
