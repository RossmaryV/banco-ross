const { query } = require('../../db/connection');
const { randomUUID } = require('crypto');

// GET /api/servicios
async function obtenerTodos() {
  const sql = `
    SELECT
      id,
      nombre_servicio,
      codigo_servicio,
      tipo_servicio,
      estado
    FROM servicios
    LIMIT 100
  `;

  console.log('▶ Ejecutando SQL servicios...');
  const rows = await query(sql);
  console.log('✅ Filas de servicios obtenidas:', rows.length);
  return rows;
}

// GET /api/servicios/:id
async function obtenerPorId(id) {
  const sql = `
    SELECT
      id,
      nombre_servicio,
      codigo_servicio,
      tipo_servicio,
      estado
    FROM servicios
    WHERE id = ?
    LIMIT 1
  `;

  const rows = await query(sql, [id]);
  return rows[0] || null;
}

// POST /api/servicios
async function crear(data) {
  const id = randomUUID();

  const {
    nombre_servicio,
    codigo_servicio,
    tipo_servicio,
    estado = 'activo',
  } = data;

  const sql = `
    INSERT INTO servicios (
      id,
      nombre_servicio,
      codigo_servicio,
      tipo_servicio,
      estado
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const params = [
    id,
    nombre_servicio,
    codigo_servicio,
    tipo_servicio,
    estado,
  ];

  await query(sql, params);

  return {
    id,
    nombre_servicio,
    codigo_servicio,
    tipo_servicio,
    estado,
  };
}

// PUT /api/servicios/:id
async function actualizar(id, data = {}) {
  const actual = await obtenerPorId(id);
  if (!actual) {
    return null; // lo maneja el controller con 404
  }

  const nombre_servicio = data.nombre_servicio ?? actual.nombre_servicio;
  const codigo_servicio = data.codigo_servicio ?? actual.codigo_servicio;
  const tipo_servicio = data.tipo_servicio ?? actual.tipo_servicio;
  const estado = data.estado ?? actual.estado;

  const sql = `
    UPDATE servicios
    SET
      nombre_servicio = ?,
      codigo_servicio = ?,
      tipo_servicio = ?,
      estado = ?
    WHERE id = ?
  `;

  const params = [
    nombre_servicio,
    codigo_servicio,
    tipo_servicio,
    estado,
    id,
  ];

  await query(sql, params);

  return {
    id,
    nombre_servicio,
    codigo_servicio,
    tipo_servicio,
    estado,
  };
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
};
