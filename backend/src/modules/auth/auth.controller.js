const authService = require('./auth.service');

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'username y password son obligatorios' });
  }

  try {
    const result = await authService.login(username, password);

    if (!result.ok) {
      if (result.reason === 'not_found' || result.reason === 'invalid_password') {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
      if (result.reason === 'blocked') {
        return res.status(403).json({ message: 'Usuario bloqueado' });
      }

      return res
        .status(500)
        .json({ message: 'Error al procesar el inicio de sesión' });
    }

    // Aquí podríamos generar un JWT más adelante.
    // Por ahora devolvemos los datos básicos del usuario.
    return res.json({
      message: 'Login correcto',
      user: result.user,
    });
  } catch (err) {
    console.error('❌ Error en login:', err);
    return res
      .status(500)
      .json({ message: 'Error interno al procesar el login' });
  }
}

module.exports = {
  login,
};
