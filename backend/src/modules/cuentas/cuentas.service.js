const { query } = require('../../db/connection');
const { randomUUID } = require('crypto');

// GET /api/cuentas
async function obtenerTodos() {
  const sql = `
    SELECT
      id,
      cliente_id,
      numero_cuenta,
      tipo_cuenta,
      saldo_actual,
      saldo_disponible,
      moneda,
      fecha_apertura,
      fecha_cierre,
      estado,
      limite_transferencia
    FROM cuentas
    LIMIT 100
  `;

  console.log('▶ Ejecutando SQL cuentas...');
  const rows = await query(sql);
  console.log('✅ Filas de cuentas obtenidas:', rows.length);
  return rows;
}

// GET /api/cuentas/:id
async function obtenerPorId(id) {
  const sql = `
    SELECT
      id,
      cliente_id,
      numero_cuenta,
      tipo_cuenta,
      saldo_actual,
      saldo_disponible,
      moneda,
      fecha_apertura,
      fecha_cierre,
      estado,
      limite_transferencia
    FROM cuentas
    WHERE id = ?
    LIMIT 1
  `;

  const rows = await query(sql, [id]);
  return rows[0] || null;
}

// POST /api/cuentas
// POST /api/cuentas
async function crear(data) {
  const id = randomUUID();

  const {
    cliente_id,
    numero_cuenta,
    tipo_cuenta,
    saldo_actual = 0,
    saldo_disponible = 0,
    moneda,
    fecha_apertura,          // puede venir o no en el body
    fecha_cierre = null,
    estado = 'activa',
    limite_transferencia = 0,
  } = data;

  
  const fechaAperturaFinal = fecha_apertura || new Date();

  const sql = `
    INSERT INTO cuentas (
      id,
      cliente_id,
      numero_cuenta,
      tipo_cuenta,
      saldo_actual,
      saldo_disponible,
      moneda,
      fecha_apertura,
      fecha_cierre,
      estado,
      limite_transferencia
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    id,
    cliente_id,
    numero_cuenta,
    tipo_cuenta,
    saldo_actual,
    saldo_disponible,
    moneda,
    fechaAperturaFinal,   // 👈 ya nunca va null
    fecha_cierre || null,
    estado,
    limite_transferencia,
  ];

  await query(sql, params);

  return {
    id,
    cliente_id,
    numero_cuenta,
    tipo_cuenta,
    saldo_actual,
    saldo_disponible,
    moneda,
    fecha_apertura: fechaAperturaFinal,
    fecha_cierre,
    estado,
    limite_transferencia,
  };
}


// PUT /api/cuentas/:id
async function actualizar(id, data = {}) {
  const actual = await obtenerPorId(id);
  if (!actual) {
    return null; // el controller mandará 404
  }

  const cliente_id = data.cliente_id ?? actual.cliente_id;
  const numero_cuenta = data.numero_cuenta ?? actual.numero_cuenta;
  const tipo_cuenta = data.tipo_cuenta ?? actual.tipo_cuenta;
  const saldo_actual = data.saldo_actual ?? actual.saldo_actual;
  const saldo_disponible = data.saldo_disponible ?? actual.saldo_disponible;
  const moneda = data.moneda ?? actual.moneda;

  // fechas: si viene string vacío, dejamos la que ya tiene
  const fecha_apertura =
    data.fecha_apertura === '' || data.fecha_apertura == null
      ? actual.fecha_apertura
      : data.fecha_apertura;

  const fecha_cierre =
    data.fecha_cierre === '' || data.fecha_cierre == null
      ? actual.fecha_cierre
      : data.fecha_cierre;

  const estado = data.estado ?? actual.estado;
  const limite_transferencia = data.limite_transferencia ?? actual.limite_transferencia;

  const sql = `
    UPDATE cuentas
    SET
      cliente_id = ?,
      numero_cuenta = ?,
      tipo_cuenta = ?,
      saldo_actual = ?,
      saldo_disponible = ?,
      moneda = ?,
      fecha_apertura = ?,
      fecha_cierre = ?,
      estado = ?,
      limite_transferencia = ?
    WHERE id = ?
  `;

  const params = [
    cliente_id,
    numero_cuenta,
    tipo_cuenta,
    saldo_actual,
    saldo_disponible,
    moneda,
    fecha_apertura || null,
    fecha_cierre || null,
    estado,
    limite_transferencia,
    id,
  ];

  await query(sql, params);

  return {
    id,
    cliente_id,
    numero_cuenta,
    tipo_cuenta,
    saldo_actual,
    saldo_disponible,
    moneda,
    fecha_apertura,
    fecha_cierre,
    estado,
    limite_transferencia,
  };
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
};
