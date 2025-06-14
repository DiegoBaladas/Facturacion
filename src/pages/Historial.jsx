import { useState, useEffect } from 'react';
import { obtenerFacturas, eliminarFactura } from '../data/facturas';
import { obtenerClientes } from '../firebase/clientes';
import { obtenerProductos } from '../data/productos';
import jsPDF from 'jspdf';

export default function Historial() {
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [facturaDetalle, setFacturaDetalle] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const f = await obtenerFacturas();
      const c = await obtenerClientes();
      const p = await obtenerProductos();
      setFacturas(f);
      setClientes(c);
      setProductos(p);
    }
    fetchData();
  }, []);

  const nombreCliente = (id) => {
    const c = clientes.find(cl => cl.id === id);
    return c ? c.nombre : '';
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que querés eliminar esta factura?')) {
      await eliminarFactura(id);
      const nuevasFacturas = await obtenerFacturas();
      setFacturas(nuevasFacturas);
      setFacturaDetalle(null);
    }
  };

  const generarPDF = (factura) => {
  const doc = new jsPDF();
  const cliente = clientes.find(c => c.id === factura.clienteId);
  const nombreCliente = cliente ? cliente.nombre : '';

  // Encabezado azul
  doc.setFillColor(33, 150, 243); // Azul
  doc.rect(0, 0, 210, 30, 'F');
  doc.setFontSize(18);
  doc.setTextColor(255);
  doc.text('Factura', 105, 18, { align: 'center' });

  // Información del cliente
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text(`Cliente: ${nombreCliente}`, 14, 40);
  doc.text(`Fecha: ${new Date(factura.fecha).toLocaleDateString()}`, 14, 48);

  // Cabecera de tabla
  let y = 60;
  doc.setFillColor(230);
  doc.rect(14, y - 6, 182, 8, 'F');
  doc.setFontSize(11);
  doc.text('Producto', 16, y);
  doc.text('Cantidad', 76, y);
  doc.text('Precio Unitario', 116, y);
  doc.text('Subtotal', 166, y);

  // Detalles de productos
  y += 6;
  factura.items.forEach((item) => {
    const prod = productos.find(p => p.id === item.productoId);
    if (!prod) return;
    const precioUnitario = prod.precio;
    const subtotalLinea = precioUnitario * item.cantidad;

    // Marco para la fila
    doc.rect(14, y - 5, 182, 8);
    doc.text(prod.nombre, 16, y);
    doc.text(String(item.cantidad), 76, y);
    doc.text(`$${precioUnitario.toFixed(2)}`, 116, y);
    doc.text(`$${subtotalLinea.toFixed(2)}`, 166, y);
    y += 10;
  });

  // Totales
  y += 10;
  doc.setFontSize(12);
  doc.text(`Subtotal: $${factura.subtotal.toFixed(2)}`, 140, y);
  y += 8;
  doc.text(`IVA (22%): $${factura.aplicarIVA ? factura.iva.toFixed(2) : '0.00'}`, 140, y);
  y += 8;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL: $${(factura.subtotal + (factura.aplicarIVA ? factura.iva : 0)).toFixed(2)}`, 140, y);

  // Marca de agua
  doc.setFontSize(30);
  doc.setTextColor(240);
  doc.text('facturasuy.netlify.app', 105, 200, { align: 'center', angle: 20 });

  doc.save(`factura_${factura.id || 'nueva'}.pdf`);
};

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Historial de Facturas</h2>

      <table className="w-full border-collapse border border-gray-300 mb-6">
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
                  onClick={() => setFacturaDetalle(f)}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Ver detalle
                </button>
                <button
                  onClick={() => generarPDF(f)}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Guardar PDF
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

      {facturaDetalle && (
        <div className="border p-4 rounded shadow max-w-3xl mx-auto bg-white">
          <h3 className="text-lg font-bold mb-2">Detalle de la factura</h3>
          <p><strong>Cliente:</strong> {nombreCliente(facturaDetalle.clienteId)}</p>
          <p><strong>Fecha:</strong> {new Date(facturaDetalle.fecha).toLocaleDateString()}</p>

          <table className="border-collapse border border-gray-300 w-full mt-4">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 py-1">Producto</th>
                <th className="border border-gray-300 px-2 py-1">Cantidad</th>
                <th className="border border-gray-300 px-2 py-1">Precio Unitario (sin IVA)</th>
                <th className="border border-gray-300 px-2 py-1">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {facturaDetalle.items.map((item, i) => {
                const prod = productos.find(p => p.id === item.productoId);
                if (!prod) return null;

                const precioUnitario = prod.precio;
                const subtotalLinea = precioUnitario * item.cantidad;

                return (
                  <tr key={i}>
                    <td className="border border-gray-300 px-2 py-1">{prod.nombre}</td>
                    <td className="border border-gray-300 px-2 py-1">{item.cantidad}</td>
                    <td className="border border-gray-300 px-2 py-1">${precioUnitario.toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-1">${subtotalLinea.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-4">
            <p><strong>Subtotal:</strong> ${facturaDetalle.subtotal.toFixed(2)}</p>
            <p><strong>IVA (22%):</strong> ${facturaDetalle.aplicarIVA ? facturaDetalle.iva.toFixed(2) : '0.00'}</p>
            <p className="font-bold"><strong>Total:</strong> ${(facturaDetalle.subtotal + (facturaDetalle.aplicarIVA ? facturaDetalle.iva : 0)).toFixed(2)}</p>
          </div>

          <button
            onClick={() => setFacturaDetalle(null)}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cerrar detalle
          </button>
        </div>
      )}
    </div>
  );
}
