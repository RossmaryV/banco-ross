const { query } = require('../../db/connection');
const { randomUUID } = require('crypto');

// GET /api/cajeros
async function obtenerTodos() {
  const sql = `
    SELECT
      id,
      codigo_cajero,
      ubicacion,
      saldo_efectivo_disponible,
      denominaciones_disponibles,
      estado,
      fecha_ultimo_abastecimiento,
      fecha_ultimo_mantenimiento
    FROM cajeros_automaticos
    LIMIT 100
  `;

  console.log('▶ Ejecutando SQL cajeros_automaticos...');
  const rows = await query(sql);
  console.log('✅ Filas de cajeros obtenidas:', rows.length);
  return rows;
}

// GET /api/cajeros/:id
async function obtenerPorId(id) {
  const sql = `
    SELECT
      id,
      codigo_cajero,
      ubicacion,
      saldo_efectivo_disponible,
      denominaciones_disponibles,
      estado,
      fecha_ultimo_abastecimiento,
      fecha_ultimo_mantenimiento
    FROM cajeros_automaticos
    WHERE id = ?
    LIMIT 1
  `;

  const rows = await query(sql, [id]);
  return rows[0] || null;
}

// POST /api/cajeros
async function crear(data) {
  const id = randomUUID();

  const {
    codigo_cajero,
    ubicacion,
    saldo_efectivo_disponible = 0,
    denominaciones_disponibles, // objeto o string JSON
    estado = 'operativo',
    fecha_ultimo_abastecimiento,
    fecha_ultimo_mantenimiento,
  } = data;

  const sql = `
    INSERT INTO cajeros_automaticos (
      id,
      codigo_cajero,
      ubicacion,
      saldo_efectivo_disponible,
      denominaciones_disponibles,
      estado,
      fecha_ultimo_abastecimiento,
      fecha_ultimo_mantenimiento
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    id,
    codigo_cajero,
    ubicacion,
    saldo_efectivo_disponible,
    denominaciones_disponibles
      ? typeof denominaciones_disponibles === 'string'
        ? denominaciones_disponibles
        : JSON.stringify(denominaciones_disponibles)
      : null,
    estado,
    fecha_ultimo_abastecimiento || null,
    fecha_ultimo_mantenimiento || null,
  ];

  await query(sql, params);

  return {
    id,
    codigo_cajero,
    ubicacion,
    saldo_efectivo_disponible,
    denominaciones_disponibles:
      typeof denominaciones_disponibles === 'string'
        ? denominaciones_disponibles
        : denominaciones_disponibles || null,
    estado,
    fecha_ultimo_abastecimiento,
    fecha_ultimo_mantenimiento,
  };
}

// PUT /api/cajeros/:id
async function actualizar(id, data = {}) {
  const actual = await obtenerPorId(id);
  if (!actual) {
    return null;
  }

  const codigo_cajero = data.codigo_cajero ?? actual.codigo_cajero;
  const ubicacion = data.ubicacion ?? actual.ubicacion;
  const saldo_efectivo_disponible =
    data.saldo_efectivo_disponible ?? actual.saldo_efectivo_disponible;

  const denominaciones_disponibles =
    data.denominaciones_disponibles != null
      ? data.denominaciones_disponibles
      : actual.denominaciones_disponibles;

  const estado = data.estado ?? actual.estado;

  const fecha_ultimo_abastecimiento =
    data.fecha_ultimo_abastecimiento === '' ||
    data.fecha_ultimo_abastecimiento == null
      ? actual.fecha_ultimo_abastecimiento
      : data.fecha_ultimo_abastecimiento;

  const fecha_ultimo_mantenimiento =
    data.fecha_ultimo_mantenimiento === '' ||
    data.fecha_ultimo_mantenimiento == null
      ? actual.fecha_ultimo_mantenimiento
      : data.fecha_ultimo_mantenimiento;

  const sql = `
    UPDATE cajeros_automaticos
    SET
      codigo_cajero = ?,
      ubicacion = ?,
      saldo_efectivo_disponible = ?,
      denominaciones_disponibles = ?,
      estado = ?,
      fecha_ultimo_abastecimiento = ?,
      fecha_ultimo_mantenimiento = ?
    WHERE id = ?
  `;

  const params = [
    codigo_cajero,
    ubicacion,
    saldo_efectivo_disponible,
    denominaciones_disponibles
      ? typeof denominaciones_disponibles === 'string'
        ? denominaciones_disponibles
        : JSON.stringify(denominaciones_disponibles)
      : null,
    estado,
    fecha_ultimo_abastecimiento || null,
    fecha_ultimo_mantenimiento || null,
    id,
  ];

  await query(sql, params);

  return {
    id,
    codigo_cajero,
    ubicacion,
    saldo_efectivo_disponible,
    denominaciones_disponibles,
    estado,
    fecha_ultimo_abastecimiento,
    fecha_ultimo_mantenimiento,
  };
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
};
