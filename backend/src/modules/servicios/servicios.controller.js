const serviciosService = require('./servicios.service');

async function listarServicios(req, res) {
  try {
    const servicios = await serviciosService.obtenerTodos();
    res.json(servicios);
  } catch (err) {
    console.error('❌ Error en listarServicios:', err);
    res.status(500).json({ message: 'Error al obtener servicios' });
  }
}

async function obtenerServicioPorId(req, res) {
  const { id } = req.params;

  try {
    const servicio = await serviciosService.obtenerPorId(id);

    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    res.json(servicio);
  } catch (err) {
    console.error('❌ Error en obtenerServicioPorId:', err);
    res.status(500).json({ message: 'Error al obtener servicio' });
  }
}

async function crearServicio(req, res) {
  try {
    const nuevo = await serviciosService.crear(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error('❌ Error en crearServicio:', err);
    res.status(500).json({ message: 'Error al crear servicio' });
  }
}

async function actualizarServicio(req, res) {
  const { id } = req.params;

  try {
    const actualizado = await serviciosService.actualizar(id, req.body);

    if (!actualizado) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    res.json(actualizado);
  } catch (err) {
    console.error('❌ Error en actualizarServicio:', err);
    res.status(500).json({ message: 'Error al actualizar servicio' });
  }
}

module.exports = {
  listarServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
};
