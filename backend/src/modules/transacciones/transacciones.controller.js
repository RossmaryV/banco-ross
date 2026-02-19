const transaccionesService = require('./transacciones.service');

async function transferir(req, res) {
  try {
    const result = await transaccionesService.transferir(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error('❌ Error en transferir:', err);
    if (err.status === 400) return res.status(400).json({ message: err.message });
    res.status(500).json({ message: 'Error al realizar transferencia' });
  }
}

async function listarTransacciones(req, res) {
  try {
    const transacciones = await transaccionesService.obtenerTodos();
    res.json(transacciones);
  } catch (err) {
    console.error('❌ Error en listarTransacciones:', err);
    res.status(500).json({ message: 'Error al obtener transacciones' });
  }
}

async function obtenerTransaccionPorId(req, res) {
  const { id } = req.params;

  try {
    const transaccion = await transaccionesService.obtenerPorId(id);

    if (!transaccion) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    res.json(transaccion);
  } catch (err) {
    console.error('❌ Error en obtenerTransaccionPorId:', err);
    res.status(500).json({ message: 'Error al obtener transacción' });
  }
}

async function crearTransaccion(req, res) {
  try {
    const nueva = await transaccionesService.crear(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    console.error('❌ Error en crearTransaccion:', err);

    if (err.status === 400) {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: 'Error al crear transacción' });
  }
}

module.exports = {
  listarTransacciones,
  obtenerTransaccionPorId,
  crearTransaccion,
  transferir,
};
