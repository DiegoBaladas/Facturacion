import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'
import Facturar from './pages/Facturar'
import Historial from './pages/Historial'
import HistorialFacturas from './pages/HistorialFacturas'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Facturar />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/historial" element={<Historial />} />
          {/* Cambié la ruta para evitar conflicto */}
          <Route path="/historial-facturas" element={<HistorialFacturas />} />
        </Routes>
      </main>

      {/* Marca de agua fija */}
      <div className="watermark">
        © Desarrollado por Diego Baladas - 2025
      </div>
    </BrowserRouter>
  )
}

export default App
