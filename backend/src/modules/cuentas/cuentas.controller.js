const cuentasService = require('./cuentas.service');

async function listarCuentas(req, res) {
  try {
    const cuentas = await cuentasService.obtenerTodos();
    res.json(cuentas);
  } catch (err) {
    console.error('❌ Error en listarCuentas:', err);
    res.status(500).json({ message: 'Error al obtener cuentas' });
  }
}

async function obtenerCuentaPorId(req, res) {
  const { id } = req.params;

  try {
    const cuenta = await cuentasService.obtenerPorId(id);

    if (!cuenta) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    res.json(cuenta);
  } catch (err) {
    console.error('❌ Error en obtenerCuentaPorId:', err);
    res.status(500).json({ message: 'Error al obtener cuenta' });
  }
}

async function crearCuenta(req, res) {
  try {
    const nueva = await cuentasService.crear(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    console.error('❌ Error en crearCuenta:', err);
    res.status(500).json({ message: 'Error al crear cuenta' });
  }
}

async function actualizarCuenta(req, res) {
  const { id } = req.params;

  try {
    const actualizada = await cuentasService.actualizar(id, req.body);

    if (!actualizada) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    res.json(actualizada);
  } catch (err) {
    console.error('❌ Error en actualizarCuenta:', err);
    res.status(500).json({ message: 'Error al actualizar cuenta' });
  }
}

module.exports = {
  listarCuentas,
  obtenerCuentaPorId,
  crearCuenta,
  actualizarCuenta,
};
