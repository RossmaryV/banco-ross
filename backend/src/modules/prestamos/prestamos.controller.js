const prestamosService = require('./prestamos.service');

async function listarPrestamos(req, res) {
  try {
    const prestamos = await prestamosService.obtenerTodos();
    res.json(prestamos);
  } catch (err) {
    console.error('❌ Error en listarPrestamos:', err);
    res.status(500).json({ message: 'Error al obtener préstamos' });
  }
}

async function obtenerPrestamoPorId(req, res) {
  const { id } = req.params;

  try {
    const prestamo = await prestamosService.obtenerPorId(id);

    if (!prestamo) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    res.json(prestamo);
  } catch (err) {
    console.error('❌ Error en obtenerPrestamoPorId:', err);
    res.status(500).json({ message: 'Error al obtener préstamo' });
  }
}

async function crearPrestamo(req, res) {
  try {
    const nuevo = await prestamosService.crear(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error('❌ Error en crearPrestamo:', err);
    res.status(500).json({ message: 'Error al crear préstamo' });
  }
}

async function actualizarPrestamo(req, res) {
  const { id } = req.params;

  try {
    const actualizado = await prestamosService.actualizar(id, req.body);

    if (!actualizado) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    res.json(actualizado);
  } catch (err) {
    console.error('❌ Error en actualizarPrestamo:', err);
    res.status(500).json({ message: 'Error al actualizar préstamo' });
  }
}

module.exports = {
  listarPrestamos,
  obtenerPrestamoPorId,
  crearPrestamo,
  actualizarPrestamo,
};
