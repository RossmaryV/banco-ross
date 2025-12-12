const express = require('express');
const router = express.Router();
const cajerosController = require('./cajeros.controller');

// GET /api/cajeros
router.get('/', cajerosController.listarCajeros);

// GET /api/cajeros/:id
router.get('/:id', cajerosController.obtenerCajeroPorId);

// POST /api/cajeros
router.post('/', cajerosController.crearCajero);

// PUT /api/cajeros/:id
router.put('/:id', cajerosController.actualizarCajero);

module.exports = router;
