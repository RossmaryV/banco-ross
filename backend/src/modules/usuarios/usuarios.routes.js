const express = require('express');
const router = express.Router();
const usuariosController = require('./usuarios.controller');

// GET /api/usuarios
router.get('/', usuariosController.listarUsuarios);

// GET /api/usuarios/:id
router.get('/:id', usuariosController.obtenerUsuarioPorId);

// POST /api/usuarios
router.post('/', usuariosController.crearUsuario);

// PUT /api/usuarios/:id
router.put('/:id', usuariosController.actualizarUsuario);

module.exports = router;
