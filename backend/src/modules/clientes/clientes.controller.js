// backend/src/modules/clientes/clientes.controller.js
const clientesService = require('./clientes.service');

async function listarClientes(req, res) {
  try {
    const clientes = await clientesService.obtenerTodos();
    res.json(clientes);
  } catch (err) {
    console.error('❌ Error en listarClientes:', err);
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
}

async function obtenerClientePorId(req, res) {
  const { id } = req.params;

  try {
    const cliente = await clientesService.obtenerPorId(id);

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json(cliente);
  } catch (err) {
    console.error('❌ Error en obtenerClientePorId:', err);
    res.status(500).json({ message: 'Error al obtener cliente' });
  }
}

async function crearCliente(req, res) {
  try {
    const nuevo = await clientesService.crear(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error('❌ Error en crearCliente:', err);
    res.status(500).json({ message: 'Error al crear cliente' });
  }
}

// 👉 nuevo: PUT /api/clientes/:id
async function actualizarCliente(req, res) {
  const { id } = req.params;

  try {
    const actualizado = await clientesService.actualizar(id, req.body);

    if (!actualizado) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json(actualizado);
  } catch (err) {
    console.error('❌ Error en actualizarCliente:', err);
    res.status(500).json({ message: 'Error al actualizar cliente' });
  }
}

module.exports = {
  listarClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
};
