const { query } = require('../../db/connection');
const { randomUUID } = require('crypto');

// PEQUEÑA AYUDA: sumar meses a una fecha
function sumarMeses(fecha, meses) {
  const f = new Date(fecha);
  f.setMonth(f.getMonth() + (meses || 0));
  return f;
}

// calcular cuota mensual de un préstamo (sistema francés simple)
function calcularCuotaMensual(monto, tasaInteres, plazoMeses) {
  if (!monto || !plazoMeses) return null;

  const tasaMensual = (tasaInteres || 0) / 100 / 12;

  if (!tasaMensual) {
    return monto / plazoMeses;
  }

  const factor = Math.pow(1 + tasaMensual, plazoMeses);
  const cuota = monto * ((tasaMensual * factor) / (factor - 1));
  return cuota;
}

// GET /api/prestamos
async function obtenerTodos() {
  const sql = `
    SELECT
      id,
      cliente_id,
      cuenta_id,
      monto_solicitado,
      monto_aprobado,
      tasa_interes,
      plazo_meses,
      cuota_mensual,
      fecha_solicitud,
      fecha_aprobacion,
      fecha_vencimiento,
      estado,
      motivo_rechazo
    FROM prestamos
    LIMIT 100
  `;

  console.log('▶ Ejecutando SQL prestamos...');
  const rows = await query(sql);
  console.log('✅ Filas de prestamos obtenidas:', rows.length);
  return rows;
}

// GET /api/prestamos/:id
async function obtenerPorId(id) {
  const sql = `
    SELECT
      id,
      cliente_id,
      cuenta_id,
      monto_solicitado,
      monto_aprobado,
      tasa_interes,
      plazo_meses,
      cuota_mensual,
      fecha_solicitud,
      fecha_aprobacion,
      fecha_vencimiento,
      estado,
      motivo_rechazo
    FROM prestamos
    WHERE id = ?
    LIMIT 1
  `;

  const rows = await query(sql, [id]);
  return rows[0] || null;
}

// POST /api/prestamos
async function crear(data) {
  const id = randomUUID();

  const {
    cliente_id,
    cuenta_id,
    monto_solicitado,
    monto_aprobado,
    tasa_interes,
    plazo_meses,
    cuota_mensual,
    fecha_solicitud,
    fecha_aprobacion,
    fecha_vencimiento,
    estado,
    motivo_rechazo,
  } = data;

  const fechaSolicitudFinal = fecha_solicitud || new Date();
  const montoAprobadoFinal =
    monto_aprobado != null ? monto_aprobado : monto_solicitado;

  const cuotaFinal =
    cuota_mensual != null
      ? cuota_mensual
      : calcularCuotaMensual(montoAprobadoFinal, tasa_interes, plazo_meses);

  const fechaVencimientoFinal =
    fecha_vencimiento || sumarMeses(fechaSolicitudFinal, plazo_meses);

  const estadoFinal = estado || 'solicitado';

  const sql = `
    INSERT INTO prestamos (
      id,
      cliente_id,
      cuenta_id,
      monto_solicitado,
      monto_aprobado,
      tasa_interes,
      plazo_meses,
      cuota_mensual,
      fecha_solicitud,
      fecha_aprobacion,
      fecha_vencimiento,
      estado,
      motivo_rechazo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    id,
    cliente_id,
    cuenta_id,
    monto_solicitado,
    montoAprobadoFinal,
    tasa_interes,
    plazo_meses,
    cuotaFinal,
    fechaSolicitudFinal,
    fecha_aprobacion || null,
    fechaVencimientoFinal,
    estadoFinal,
    motivo_rechazo || null,
  ];

  await query(sql, params);

  return {
    id,
    cliente_id,
    cuenta_id,
    monto_solicitado,
    monto_aprobado: montoAprobadoFinal,
    tasa_interes,
    plazo_meses,
    cuota_mensual: cuotaFinal,
    fecha_solicitud: fechaSolicitudFinal,
    fecha_aprobacion: fecha_aprobacion || null,
    fecha_vencimiento: fechaVencimientoFinal,
    estado: estadoFinal,
    motivo_rechazo: motivo_rechazo || null,
  };
}

// PUT /api/prestamos/:id
// PUT /api/prestamos/:id
async function actualizar(id, data = {}) {
  const actual = await obtenerPorId(id);
  if (!actual) {
    return null;
  }

  const cliente_id = data.cliente_id ?? actual.cliente_id;
  const cuenta_id = data.cuenta_id ?? actual.cuenta_id;
  const monto_solicitado =
    data.monto_solicitado ?? actual.monto_solicitado;
  const monto_aprobado = data.monto_aprobado ?? actual.monto_aprobado;
  const tasa_interes = data.tasa_interes ?? actual.tasa_interes;
  const plazo_meses = data.plazo_meses ?? actual.plazo_meses;

  let cuota_mensual =
    data.cuota_mensual != null ? data.cuota_mensual : actual.cuota_mensual;

  // si cambian monto_aprobado / tasa / plazo, recalculamos cuota
  if (
    data.monto_aprobado != null ||
    data.tasa_interes != null ||
    data.plazo_meses != null
  ) {
    cuota_mensual = calcularCuotaMensual(
      monto_aprobado,
      tasa_interes,
      plazo_meses
    );
  }

  const fecha_solicitud =
    data.fecha_solicitud === '' || data.fecha_solicitud == null
      ? actual.fecha_solicitud
      : data.fecha_solicitud;

  const fecha_aprobacion =
    data.fecha_aprobacion === '' || data.fecha_aprobacion == null
      ? actual.fecha_aprobacion
      : data.fecha_aprobacion;

  const fecha_vencimiento =
    data.fecha_vencimiento === '' || data.fecha_vencimiento == null
      ? actual.fecha_vencimiento
      : data.fecha_vencimiento;

  const estado = data.estado ?? actual.estado;
  const motivo_rechazo = data.motivo_rechazo ?? actual.motivo_rechazo;

  const sql = `
    UPDATE prestamos
    SET
      cliente_id = ?,
      cuenta_id = ?,
      monto_solicitado = ?,
      monto_aprobado = ?,
      tasa_interes = ?,
      plazo_meses = ?,
      cuota_mensual = ?,
      fecha_solicitud = ?,
      fecha_aprobacion = ?,
      fecha_vencimiento = ?,
      estado = ?,
      motivo_rechazo = ?
    WHERE id = ?
  `;

  // 🔴 AQUÍ ESTABA EL PROBLEMA: el orden no coincidía
  const params = [
    cliente_id,          // cliente_id
    cuenta_id,           // cuenta_id
    monto_solicitado,    // monto_solicitado
    monto_aprobado,      // monto_aprobado
    tasa_interes,        // tasa_interes
    plazo_meses,         // plazo_meses
    cuota_mensual,       // cuota_mensual
    fecha_solicitud || null,
    fecha_aprobacion || null,
    fecha_vencimiento || null,
    estado,
    motivo_rechazo || null,
    id,
  ];

  await query(sql, params);

  return {
    id,
    cliente_id,
    cuenta_id,
    monto_solicitado,
    monto_aprobado,
    tasa_interes,
    plazo_meses,
    cuota_mensual,
    fecha_solicitud,
    fecha_aprobacion,
    fecha_vencimiento,
    estado,
    motivo_rechazo,
  };
}


module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
};
