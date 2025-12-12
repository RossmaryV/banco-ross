const tarjetasService = require('./tarjetas.service');

async function listarTarjetas(req, res) {
  try {
    const tarjetas = await tarjetasService.obtenerTodos();
    res.json(tarjetas);
  } catch (err) {
    console.error('❌ Error en listarTarjetas:', err);
    res.status(500).json({ message: 'Error al obtener tarjetas' });
  }
}

async function obtenerTarjetaPorId(req, res) {
  const { id } = req.params;

  try {
    const tarjeta = await tarjetasService.obtenerPorId(id);

    if (!tarjeta) {
      return res.status(404).json({ message: 'Tarjeta no encontrada' });
    }

    res.json(tarjeta);
  } catch (err) {
    console.error('❌ Error en obtenerTarjetaPorId:', err);
    res.status(500).json({ message: 'Error al obtener tarjeta' });
  }
}

async function crearTarjeta(req, res) {
  try {
    const nueva = await tarjetasService.crear(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    console.error('❌ Error en crearTarjeta:', err);
    res.status(500).json({ message: 'Error al crear tarjeta' });
  }
}

async function actualizarTarjeta(req, res) {
  const { id } = req.params;

  try {
    const actualizada = await tarjetasService.actualizar(id, req.body);

    if (!actualizada) {
      return res.status(404).json({ message: 'Tarjeta no encontrada' });
    }

    res.json(actualizada);
  } catch (err) {
    console.error('❌ Error en actualizarTarjeta:', err);
    res.status(500).json({ message: 'Error al actualizar tarjeta' });
  }
}

module.exports = {
  listarTarjetas,
  obtenerTarjetaPorId,
  crearTarjeta,
  actualizarTarjeta,
};
