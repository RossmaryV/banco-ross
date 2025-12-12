const { query } = require('../../db/connection');
const { randomUUID } = require('crypto');

// GET /api/tarjetas
async function obtenerTodos() {
  const sql = `
    SELECT
      id,
      cuenta_id,
      numero_tarjeta,
      tipo_tarjeta,
      fecha_emision,
      fecha_vencimiento,
      codigo_seguridad,
      limite_credito,
      limite_diario_retiro,
      estado
    FROM tarjetas
    LIMIT 100
  `;

  console.log('▶ Ejecutando SQL tarjetas...');
  const rows = await query(sql);
  console.log('✅ Filas de tarjetas obtenidas:', rows.length);
  return rows;
}

// GET /api/tarjetas/:id
async function obtenerPorId(id) {
  const sql = `
    SELECT
      id,
      cuenta_id,
      numero_tarjeta,
      tipo_tarjeta,
      fecha_emision,
      fecha_vencimiento,
      codigo_seguridad,
      limite_credito,
      limite_diario_retiro,
      estado
    FROM tarjetas
    WHERE id = ?
    LIMIT 1
  `;

  const rows = await query(sql, [id]);
  return rows[0] || null;
}

// POST /api/tarjetas
async function crear(data) {
  const id = randomUUID();

  const {
    cuenta_id,
    numero_tarjeta,
    tipo_tarjeta, // 'debito' | 'credito'
    fecha_emision,
    fecha_vencimiento,
    codigo_seguridad = null,
    limite_credito = 0,
    limite_diario_retiro = 0,
    estado = 'activa',
  } = data;

  // si no vienen fechas, usamos la fecha actual para no romper el NOT NULL
  const fechaEmisionFinal = fecha_emision || new Date();
  const fechaVencimientoFinal = fecha_vencimiento || new Date();

  const sql = `
    INSERT INTO tarjetas (
      id,
      cuenta_id,
      numero_tarjeta,
      tipo_tarjeta,
      fecha_emision,
      fecha_vencimiento,
      codigo_seguridad,
      limite_credito,
      limite_diario_retiro,
      estado
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    id,
    cuenta_id,
    numero_tarjeta,
    tipo_tarjeta,
    fechaEmisionFinal,
    fechaVencimientoFinal,
    codigo_seguridad,
    limite_credito,
    limite_diario_retiro,
    estado,
  ];

  await query(sql, params);

  return {
    id,
    cuenta_id,
    numero_tarjeta,
    tipo_tarjeta,
    fecha_emision: fechaEmisionFinal,
    fecha_vencimiento: fechaVencimientoFinal,
    codigo_seguridad,
    limite_credito,
    limite_diario_retiro,
    estado,
  };
}

// PUT /api/tarjetas/:id
async function actualizar(id, data = {}) {
  const actual = await obtenerPorId(id);
  if (!actual) {
    return null;
  }

  const cuenta_id = data.cuenta_id ?? actual.cuenta_id;
  const numero_tarjeta = data.numero_tarjeta ?? actual.numero_tarjeta;
  const tipo_tarjeta = data.tipo_tarjeta ?? actual.tipo_tarjeta;

  const fecha_emision =
    data.fecha_emision === '' || data.fecha_emision == null
      ? actual.fecha_emision
      : data.fecha_emision;

  const fecha_vencimiento =
    data.fecha_vencimiento === '' || data.fecha_vencimiento == null
      ? actual.fecha_vencimiento
      : data.fecha_vencimiento;

  const codigo_seguridad = data.codigo_seguridad ?? actual.codigo_seguridad;
  const limite_credito = data.limite_credito ?? actual.limite_credito;
  const limite_diario_retiro =
    data.limite_diario_retiro ?? actual.limite_diario_retiro;
  const estado = data.estado ?? actual.estado;

  const sql = `
    UPDATE tarjetas
    SET
      cuenta_id = ?,
      numero_tarjeta = ?,
      tipo_tarjeta = ?,
      fecha_emision = ?,
      fecha_vencimiento = ?,
      codigo_seguridad = ?,
      limite_credito = ?,
      limite_diario_retiro = ?,
      estado = ?
    WHERE id = ?
  `;

  const params = [
    cuenta_id,
    numero_tarjeta,
    tipo_tarjeta,
    fecha_emision || null,
    fecha_vencimiento || null,
    codigo_seguridad,
    limite_credito,
    limite_diario_retiro,
    estado,
    id,
  ];

  await query(sql, params);

  return {
    id,
    cuenta_id,
    numero_tarjeta,
    tipo_tarjeta,
    fecha_emision,
    fecha_vencimiento,
    codigo_seguridad,
    limite_credito,
    limite_diario_retiro,
    estado,
  };
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
};
