// backend/src/modules/clientes/clientes.routes.js
const express = require('express');
const router = express.Router();
const clientesController = require('./clientes.controller');

// GET /api/clientes
router.get('/', clientesController.listarClientes);

// 👉 GET /api/clientes/:id
router.get('/:id', clientesController.obtenerClientePorId);

// POST /api/clientes
router.post('/', clientesController.crearCliente);

// 👉 PUT /api/clientes/:id
router.put('/:id', clientesController.actualizarCliente);

module.exports = router;
