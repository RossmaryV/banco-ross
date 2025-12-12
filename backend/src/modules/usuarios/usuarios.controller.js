const usuariosService = require('./usuarios.service');

async function listarUsuarios(req, res) {
  try {
    const usuarios = await usuariosService.obtenerTodos();
    res.json(usuarios);
  } catch (err) {
    console.error('❌ Error en listarUsuarios:', err);
    res.status(500).json({ message: 'Error al obtener usuarios del sistema' });
  }
}

async function obtenerUsuarioPorId(req, res) {
  const { id } = req.params;

  try {
    const usuario = await usuariosService.obtenerPorId(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (err) {
    console.error('❌ Error en obtenerUsuarioPorId:', err);
    res.status(500).json({ message: 'Error al obtener usuario del sistema' });
  }
}

async function crearUsuario(req, res) {
  try {
    const nuevo = await usuariosService.crear(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error('❌ Error en crearUsuario:', err);
    res.status(500).json({ message: 'Error al crear usuario del sistema' });
  }
}

async function actualizarUsuario(req, res) {
  const { id } = req.params;

  try {
    const actualizado = await usuariosService.actualizar(id, req.body);

    if (!actualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(actualizado);
  } catch (err) {
    console.error('❌ Error en actualizarUsuario:', err);
    res.status(500).json({ message: 'Error al actualizar usuario del sistema' });
  }
}

module.exports = {
  listarUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
};
