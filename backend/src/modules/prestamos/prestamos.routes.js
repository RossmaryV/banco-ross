const express = require('express');
const router = express.Router();
const prestamosController = require('./prestamos.controller');

// GET /api/prestamos
router.get('/', prestamosController.listarPrestamos);

// GET /api/prestamos/:id
router.get('/:id', prestamosController.obtenerPrestamoPorId);

// POST /api/prestamos
router.post('/', prestamosController.crearPrestamo);

// PUT /api/prestamos/:id
router.put('/:id', prestamosController.actualizarPrestamo);

module.exports = router;
