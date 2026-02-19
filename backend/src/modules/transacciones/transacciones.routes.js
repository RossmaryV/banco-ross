const express = require('express');
const router = express.Router();
const transaccionesController = require('./transacciones.controller');

// GET /api/transacciones
router.get('/', transaccionesController.listarTransacciones);

router.post('/transferir', transaccionesController.transferir);

// GET /api/transacciones/:id
router.get('/:id', transaccionesController.obtenerTransaccionPorId);

// POST /api/transacciones
router.post('/', transaccionesController.crearTransaccion);

module.exports = router;
