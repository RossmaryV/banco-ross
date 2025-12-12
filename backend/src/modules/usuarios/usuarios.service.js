const { query } = require('../../db/connection');
const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

// GET /api/usuarios
async function obtenerTodos() {
  const sql = `
    SELECT
      id,
      cliente_id,
      username,
      rol_id,
      fecha_creacion,
      fecha_ultimo_acceso,
      estado,
      intentos_fallidos,
      fecha_ultimo_cambio_password
    FROM usuarios_sistema
    LIMIT 100
  `;

  console.log('▶ Ejecutando SQL usuarios_sistema...');
  const rows = await query(sql);
  console.log('✅ Filas de usuarios obtenidas:', rows.length);
  return rows;
}

// GET /api/usuarios/:id
async function obtenerPorId(id) {
  const sql = `
    SELECT
      id,
      cliente_id,
      username,
      rol_id,
      fecha_creacion,
      fecha_ultimo_acceso,
      estado,
      intentos_fallidos,
      fecha_ultimo_cambio_password
    FROM usuarios_sistema
    WHERE id = ?
    LIMIT 1
  `;

  const rows = await query(sql, [id]);
  return rows[0] || null;
}

// POST /api/usuarios
// Espera que venga un password en data.password_hash (en texto plano)
// y aquí lo convierte en hash antes de guardar.
async function crear(data) {
  const id = randomUUID();

  const {
    cliente_id = null,
    username,
    password_hash, // en realidad viene la contraseña en texto plano
    rol_id,
    estado = 'activo',
    intentos_fallidos = 0,
    fecha_ultimo_acceso = null,
    fecha_ultimo_cambio_password = null,
  } = data;

  if (!password_hash) {
    throw new Error(
      'Se requiere una contraseña (password_hash) para crear el usuario'
    );
  }

  // 👉 aquí hasheamos la contraseña
  const hashedPassword = await bcrypt.hash(password_hash, SALT_ROUNDS);

  const sql = `
    INSERT INTO usuarios_sistema (
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
    ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?)
  `;

  const params = [
    id,
    cliente_id,
    username,
    hashedPassword,
    rol_id,
    fecha_ultimo_acceso,
    estado,
    intentos_fallidos,
    fecha_ultimo_cambio_password,
  ];

  await query(sql, params);

  return {
    id,
    cliente_id,
    username,
    rol_id,
    estado,
    fecha_ultimo_acceso,
    intentos_fallidos,
    fecha_ultimo_cambio_password,
  };
}

// PUT /api/usuarios/:id
// Si viene un password_hash nuevo, lo hasheamos y actualizamos.
// Si no viene, dejamos el hash actual tal cual.
async function actualizar(id, data = {}) {
  const actual = await obtenerPorId(id);
  if (!actual) {
    return null; // el controlador devolverá 404
  }

  const cliente_id =
    data.cliente_id === undefined ? actual.cliente_id : data.cliente_id;
  const username = data.username ?? actual.username;
  const rol_id = data.rol_id ?? actual.rol_id;
  const estado = data.estado ?? actual.estado;
  const intentos_fallidos =
    data.intentos_fallidos ?? actual.intentos_fallidos;

  let password_hash;
  if (data.password_hash !== undefined) {
    // si viene string vacío, no cambiamos la contraseña
    if (data.password_hash && data.password_hash.trim() !== '') {
      password_hash = await bcrypt.hash(data.password_hash, SALT_ROUNDS);
    } else {
      password_hash = null; // marca para "no tocar"
    }
  }

  const fecha_ultimo_acceso =
    data.fecha_ultimo_acceso === undefined
      ? actual.fecha_ultimo_acceso
      : data.fecha_ultimo_acceso || null;

  const fecha_ultimo_cambio_password =
    data.fecha_ultimo_cambio_password === undefined
      ? actual.fecha_ultimo_cambio_password
      : data.fecha_ultimo_cambio_password || null;

  // armamos dinámicamente los campos a actualizar
  const campos = [
    'cliente_id = ?',
    'username = ?',
    'rol_id = ?',
    'estado = ?',
    'intentos_fallidos = ?',
    'fecha_ultimo_acceso = ?',
    'fecha_ultimo_cambio_password = ?',
  ];
  const params = [
    cliente_id,
    username,
    rol_id,
    estado,
    intentos_fallidos,
    fecha_ultimo_acceso,
    fecha_ultimo_cambio_password,
  ];

  if (password_hash !== undefined) {
    if (password_hash !== null) {
      // hubo contraseña nueva -> actualizamos el hash
      campos.splice(3, 0, 'password_hash = ?'); // la metemos antes de estado
      params.splice(3, 0, password_hash);
    }
    // si es null: significa que vino string vacío -> no tocamos el hash
  }

  const sql = `
    UPDATE usuarios_sistema
    SET
      ${campos.join(', ')}
    WHERE id = ?
  `;

  params.push(id);

  await query(sql, params);

  return {
    id,
    cliente_id,
    username,
    rol_id,
    estado,
    intentos_fallidos,
    fecha_ultimo_acceso,
    fecha_ultimo_cambio_password,
  };
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
};
