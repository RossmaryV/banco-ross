const express = require('express');
const router = express.Router();
const tarjetasController = require('./tarjetas.controller');

// GET /api/tarjetas
router.get('/', tarjetasController.listarTarjetas);

// GET /api/tarjetas/:id
router.get('/:id', tarjetasController.obtenerTarjetaPorId);

// POST /api/tarjetas
router.post('/', tarjetasController.crearTarjeta);

// PUT /api/tarjetas/:id
router.put('/:id', tarjetasController.actualizarTarjeta);

module.exports = router;
