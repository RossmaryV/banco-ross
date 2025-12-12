const { query } = require('../../db/connection');
const bcrypt = require('bcrypt');

// Busca usuario por username y valida la contraseña
async function login(username, password) {
  const sql = `
    SELECT
      id,
      cliente_id,
      username,
      password_hash,
      rol_id,
      fecha_creacion,
      fecha_ultimo_acceso,
      estado,
      intentos_fallidos,
      fecha_ultimo_cambio_password
    FROM usuarios_sistema
    WHERE username = ?
    LIMIT 1
  `;

  const rows = await query(sql, [username]);
  const usuario = rows[0];

  if (!usuario) {
    return { ok: false, reason: 'not_found' };
  }

  if (usuario.estado === 'bloqueado') {
    return { ok: false, reason: 'blocked' };
  }

  const coincide = await bcrypt.compare(password, usuario.password_hash);

  if (!coincide) {
    // opcional: sumar intentos_fallidos
    await query(
      `
      UPDATE usuarios_sistema
      SET intentos_fallidos = intentos_fallidos + 1
      WHERE id = ?
    `,
      [usuario.id]
    );

    return { ok: false, reason: 'invalid_password' };
  }

  // si llegó aquí, la contraseña es correcta
  await query(
    `
    UPDATE usuarios_sistema
    SET
      fecha_ultimo_acceso = CURRENT_TIMESTAMP,
      intentos_fallidos = 0
    WHERE id = ?
  `,
    [usuario.id]
  );

  // devolvemos solo datos "seguros" (sin password_hash)
  const { password_hash, ...safeUser } = usuario;

  return { ok: true, user: safeUser };
}

module.exports = {
  login,
};
