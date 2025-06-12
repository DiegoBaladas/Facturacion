import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex gap-4">
      <Link to="/">Facturar</Link>
      <Link to="/productos">Productos</Link>
      <Link to="/clientes">Clientes</Link>
      <Link to="/historial">Historial</Link>
    </nav>
  )
}