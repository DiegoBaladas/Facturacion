import { useState, useEffect } from 'react';
import { obtenerFacturas } from '../data/facturas';
import { obtenerClientes } from '../firebase/clientes';
import { obtenerProductos } from '../data/productos';
import jsPDF from 'jspdf';

export default function Historial() {
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [facturaDetalle, setFacturaDetalle] = useState(null);

  useEffect(() => {
    obtenerFacturas().then(setFacturas);
    obtenerClientes().then(setClientes);
    obtenerProductos().then(setProductos);
  }, []);

  const nombreCliente = (id) => {
    const c = clientes.find(cl => cl.id === id);
    return c ? c.nombre : '';
  };

  const productoInfo = (id) => {
    return productos.find(p => p.id === id);
  };

  const mostrarDetalle = (factura) => {
    setFacturaDetalle(factura);
  };

  const cerrarDetalle = () => {
    setFacturaDetalle(null);
  };

  const exportarPDF = () => {
    if (!facturaDetalle) return;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    let y = margin;

    // Título
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Factura', margin, y);

    y += 30;

    // Datos cliente y fecha
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${nombreCliente(facturaDetalle.clienteId)}`, margin, y);
    doc.text(`Fecha: ${new Date(facturaDetalle.fecha).toLocaleDateString()}`, 400, y);
    y += 18;
    doc.text(`IVA aplicado: ${facturaDetalle.aplicarIVA ? 'Sí' : 'No'}`, margin, y);
    y += 30;

    // Línea separadora
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin, y, 555, y);
    y += 15;

    // Tabla encabezado
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, y - 12, 515, 20, 'F');
    doc.text('Código', margin + 5, y);
    doc.text('Producto', margin + 70, y);
    doc.text('Cantidad', margin + 320, y, null, null, 'right');
    doc.text('Precio Unit.', margin + 400, y, null, null, 'right');
    doc.text('Subtotal', margin + 490, y, null, null, 'right');
    y += 25;

    doc.setFont('helvetica', 'normal');

    facturaDetalle.items.forEach(item => {
      const p = productoInfo(item.productoId);
      if (!p) return;

      const precioUnitario = facturaDetalle.aplicarIVA ? p.precio * 1.22 : p.precio;
      const subtotalItem = precioUnitario * item.cantidad;

      if (y > 750) {
        doc.addPage();
        y = margin;
      }

      doc.text(p.codigo, margin + 5, y);
      doc.text(p.nombre, margin + 70, y);
      doc.text(String(item.cantidad), margin + 320, y, null, null, 'right');
      doc.text(`$${precioUnitario.toFixed(2)}`, margin + 400, y, null, null, 'right');
      doc.text(`$${subtotalItem.toFixed(2)}`, margin + 490, y, null, null, 'right');
      y += 20;
    });

    y += 15;

    // Línea separadora
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin, y, 555, y);
    y += 20;

    // Totales (alineados a la derecha)
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', margin + 390, y, null, null, 'right');
    doc.setFont('helvetica', 'normal');
    doc.text(`$${facturaDetalle.subtotal.toFixed(2)}`, margin + 490, y, null, null, 'right');
    y += 20;

    doc.setFont('helvetica', 'bold');
    doc.text('IVA (22%):', margin + 390, y, null, null, 'right');
    doc.setFont('helvetica', 'normal');
    doc.text(`$${facturaDetalle.iva.toFixed(2)}`, margin + 490, y, null, null, 'right');
    y += 25;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', margin + 390, y, null, null, 'right');
    doc.text(`$${facturaDetalle.total.toFixed(2)}`, margin + 490, y, null, null, 'right');

    // Guardar PDF con nombre claro
    doc.save(`Factura_${facturaDetalle.id || 'sin_id'}.pdf`);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Historial de Facturas</h2>

      <table className="w-full border-collapse border border-gray-300 max-w-4xl mb-6">
        <thead>
          <tr>
            <th className="border border-gray-300 px-2 py-1">Cliente</th>
            <th className="border border-gray-300 px-2 py-1">Fecha</th>
            <th className="border border-gray-300 px-2 py-1">Total</th>
            <th className="border border-gray-300 px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4">No hay facturas</td>
            </tr>
          )}
          {facturas.map(factura => (
            <tr key={factura.id}>
              <td className="border border-gray-300 px-2 py-1">{nombreCliente(factura.clienteId)}</td>
              <td className="border border-gray-300 px-2 py-1">
                {new Date(factura.fecha).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-2 py-1">${factura.total.toFixed(2)}</td>
              <td className="border border-gray-300 px-2 py-1 space-x-2">
                <button
                  onClick={() => mostrarDetalle(factura)}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Ver detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {facturaDetalle && (
        <div className="border p-4 max-w-4xl rounded shadow bg-white">
          <h3 className="text-lg font-bold mb-3">Detalle de Factura</h3>
          <p><strong>Cliente:</strong> {nombreCliente(facturaDetalle.clienteId)}</p>
          <p><strong>Fecha:</strong> {new Date(facturaDetalle.fecha).toLocaleDateString()}</p>
          <p><strong>IVA aplicado:</strong> {facturaDetalle.aplicarIVA ? 'Sí' : 'No'}</p>

          <table className="w-full border-collapse border border-gray-300 my-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1">Código</th>
                <th className="border border-gray-300 px-2 py-1">Producto</th>
                <th className="border border-gray-300 px-2 py-1">Cantidad</th>
                <th className="border border-gray-300 px-2 py-1">Precio Unit.</th>
                <th className="border border-gray-300 px-2 py-1">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {facturaDetalle.items.map((item, i) => {
                const p = productoInfo(item.productoId);
                if (!p) return null;
                const precioUnitario = facturaDetalle.aplicarIVA ? p.precio * 1.22 : p.precio;
                const subtotalItem = precioUnitario * item.cantidad;
                return (
                  <tr key={i}>
                    <td className="border border-gray-300 px-2 py-1">{p.codigo}</td>
                    <td className="border border-gray-300 px-2 py-1">{p.nombre}</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">{item.cantidad}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">${precioUnitario.toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">${subtotalItem.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="text-right space-y-1">
            <p><strong>Subtotal:</strong> ${facturaDetalle.subtotal.toFixed(2)}</p>
            <p><strong>IVA (22%):</strong> ${facturaDetalle.iva.toFixed(2)}</p>
            <p className="text-xl font-bold"><strong>Total:</strong> ${facturaDetalle.total.toFixed(2)}</p>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={exportarPDF}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Guardar como PDF
            </button>
            <button
              onClick={cerrarDetalle}
              className="bg-gray-400 px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
