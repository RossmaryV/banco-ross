const express = require('express');
const router = express.Router();
const cuentasController = require('./cuentas.controller');

// GET /api/cuentas
router.get('/', cuentasController.listarCuentas);

// GET /api/cuentas/:id
router.get('/:id', cuentasController.obtenerCuentaPorId);

// POST /api/cuentas
router.post('/', cuentasController.crearCuenta);

// PUT /api/cuentas/:id
router.put('/:id', cuentasController.actualizarCuenta);

module.exports = router;
