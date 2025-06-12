// src/firebase/clientes.js (versión localStorage)

const STORAGE_KEY = 'clientes';

// Obtener todos los clientes
export async function obtenerClientes() {
  const json = localStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

// Guardar (crear o actualizar) un cliente
export async function guardarCliente(cliente) {
  const clientes = await obtenerClientes();

  if (cliente.id) {
    // Actualizar
    const index = clientes.findIndex(c => c.id === cliente.id);
    if (index !== -1) {
      clientes[index] = { ...clientes[index], ...cliente };
    }
  } else {
    // Crear
    cliente.id = crypto.randomUUID();
    clientes.push(cliente);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
}

// Eliminar cliente por ID
export async function eliminarCliente(id) {
  const clientes = await obtenerClientes();
  const nuevosClientes = clientes.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosClientes));
}
