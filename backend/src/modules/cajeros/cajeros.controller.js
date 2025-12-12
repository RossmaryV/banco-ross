const cajerosService = require('./cajeros.service');

async function listarCajeros(req, res) {
  try {
    const cajeros = await cajerosService.obtenerTodos();
    res.json(cajeros);
  } catch (err) {
    console.error('❌ Error en listarCajeros:', err);
    res.status(500).json({ message: 'Error al obtener cajeros automáticos' });
  }
}

async function obtenerCajeroPorId(req, res) {
  const { id } = req.params;

  try {
    const cajero = await cajerosService.obtenerPorId(id);

    if (!cajero) {
      return res.status(404).json({ message: 'Cajero no encontrado' });
    }

    res.json(cajero);
  } catch (err) {
    console.error('❌ Error en obtenerCajeroPorId:', err);
    res.status(500).json({ message: 'Error al obtener cajero automático' });
  }
}

async function crearCajero(req, res) {
  try {
    const nuevo = await cajerosService.crear(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error('❌ Error en crearCajero:', err);
    res.status(500).json({ message: 'Error al crear cajero automático' });
  }
}

async function actualizarCajero(req, res) {
  const { id } = req.params;

  try {
    const actualizado = await cajerosService.actualizar(id, req.body);

    if (!actualizado) {
      return res.status(404).json({ message: 'Cajero no encontrado' });
    }

    res.json(actualizado);
  } catch (err) {
    console.error('❌ Error en actualizarCajero:', err);
    res.status(500).json({ message: 'Error al actualizar cajero automático' });
  }
}

module.exports = {
  listarCajeros,
  obtenerCajeroPorId,
  crearCajero,
  actualizarCajero,
};
