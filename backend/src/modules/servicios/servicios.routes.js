const express = require('express');
const router = express.Router();
const serviciosController = require('./servicios.controller');

// GET /api/servicios
router.get('/', serviciosController.listarServicios);

// GET /api/servicios/:id
router.get('/:id', serviciosController.obtenerServicioPorId);

// POST /api/servicios
router.post('/', serviciosController.crearServicio);

// PUT /api/servicios/:id
router.put('/:id', serviciosController.actualizarServicio);

module.exports = router;
