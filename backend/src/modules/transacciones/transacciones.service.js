const { query } = require('../../db/connection');
const { randomUUID } = require('crypto');

// Helpers
async function obtenerCuentaPorId(id) {
  const rows = await query(
    `
    SELECT id, saldo_actual, saldo_disponible, moneda
    FROM cuentas
    WHERE id = ?
    LIMIT 1
  `,
    [id]
  );
  return rows[0] || null;
}

async function actualizarSaldosCuenta(id, saldo_actual, saldo_disponible) {
  await query(
    `
    UPDATE cuentas
    SET saldo_actual = ?, saldo_disponible = ?
    WHERE id = ?
  `,
    [saldo_actual, saldo_disponible, id]
  );
}

// Para lanzar errores "lindos" de negocio (400)
function crearErrorNegocio(mensaje) {
  const err = new Error(mensaje);
  err.status = 400;
  return err;
}

// GET /api/transacciones
async function obtenerTodos() {
  const sql = `
    SELECT
      id,
      tipo_transaccion,
      cuenta_origen_id,
      cuenta_destino_id,
      cajero_id,
      servicio_id,
      monto,
      moneda,
      fecha_hora_transaccion,
      descripcion,
      estado,
      codigo_autorizacion,
      referencia_pago
    FROM transacciones
    ORDER BY fecha_hora_transaccion DESC
    LIMIT 100
  `;

  console.log('▶ Ejecutando SQL transacciones...');
  const rows = await query(sql);
  console.log('✅ Filas de transacciones obtenidas:', rows.length);
  return rows;
}

// GET /api/transacciones/:id
async function obtenerPorId(id) {
  const sql = `
    SELECT
      id,
      tipo_transaccion,
      cuenta_origen_id,
      cuenta_destino_id,
      cajero_id,
      servicio_id,
      monto,
      moneda,
      fecha_hora_transaccion,
      descripcion,
      estado,
      codigo_autorizacion,
      referencia_pago
    FROM transacciones
    WHERE id = ?
    LIMIT 1
  `;

  const rows = await query(sql, [id]);
  return rows[0] || null;
}

// POST /api/transacciones
async function crear(data) {
  const id = randomUUID();

  let {
    tipo_transaccion, // 'retiro' | 'deposito' | 'transferencia' | 'pago_servicio' | 'consulta'
    cuenta_origen_id,
    cuenta_destino_id,
    cajero_id,
    servicio_id,
    monto,
    moneda,
    descripcion,
    estado,
    codigo_autorizacion,
    referencia_pago,
  } = data;

  if (!tipo_transaccion) {
    throw crearErrorNegocio('El tipo de transacción es obligatorio');
  }

  if (!cuenta_origen_id) {
    throw crearErrorNegocio('La cuenta de origen es obligatoria');
  }

  const montoNum = Number(monto);
  if (!montoNum || montoNum <= 0) {
    throw crearErrorNegocio('El monto debe ser mayor a cero');
  }

  // Obtenemos la cuenta de origen
  const cuentaOrigen = await obtenerCuentaPorId(cuenta_origen_id);
  if (!cuentaOrigen) {
    throw crearErrorNegocio('La cuenta de origen no existe');
  }

  if (!moneda) {
    moneda = cuentaOrigen.moneda; // por defecto, moneda de la cuenta
  }

  let cuentaDestino = null;
  if (tipo_transaccion === 'transferencia') {
    if (!cuenta_destino_id) {
      throw crearErrorNegocio('La cuenta destino es obligatoria para transferencias');
    }
    cuentaDestino = await obtenerCuentaPorId(cuenta_destino_id);
    if (!cuentaDestino) {
      throw crearErrorNegocio('La cuenta destino no existe');
    }

    if (cuentaDestino.moneda !== moneda || cuentaOrigen.moneda !== moneda) {
      throw crearErrorNegocio('Las cuentas deben estar en la misma moneda para transferencias');
    }
  }

  // Copia de saldos actuales
  let saldoOrigen = Number(cuentaOrigen.saldo_actual);
  let saldoDispOrigen = Number(cuentaOrigen.saldo_disponible);

  let saldoDestino = cuentaDestino ? Number(cuentaDestino.saldo_actual) : null;
  let saldoDispDestino = cuentaDestino ? Number(cuentaDestino.saldo_disponible) : null;

  // Lógica según tipo
  switch (tipo_transaccion) {
    case 'deposito':
      saldoOrigen += montoNum;
      saldoDispOrigen += montoNum;
      estado = 'completada';
      break;

    case 'retiro':
      if (saldoDispOrigen < montoNum) {
        throw crearErrorNegocio('Saldo insuficiente para retiro');
      }
      saldoOrigen -= montoNum;
      saldoDispOrigen -= montoNum;
      estado = 'completada';
      break;

    case 'transferencia':
      if (saldoDispOrigen < montoNum) {
        throw crearErrorNegocio('Saldo insuficiente para transferencia');
      }
      // Debita origen
      saldoOrigen -= montoNum;
      saldoDispOrigen -= montoNum;
      // Acredita destino
      saldoDestino += montoNum;
      saldoDispDestino += montoNum;
      estado = 'completada';
      break;

    case 'pago_servicio':
      if (saldoDispOrigen < montoNum) {
        throw crearErrorNegocio('Saldo insuficiente para pago de servicio');
      }
      saldoOrigen -= montoNum;
      saldoDispOrigen -= montoNum;
      estado = 'completada';
      break;

    case 'consulta':
      // No modifica saldos
      estado = estado || 'completada';
      break;

    default:
      throw crearErrorNegocio('Tipo de transacción no soportado');
  }

  // Actualizamos saldos si corresponde
  if (tipo_transaccion !== 'consulta') {
    await actualizarSaldosCuenta(
      cuentaOrigen.id,
      saldoOrigen,
      saldoDispOrigen
    );

    if (tipo_transaccion === 'transferencia' && cuentaDestino) {
      await actualizarSaldosCuenta(
        cuentaDestino.id,
        saldoDestino,
        saldoDispDestino
      );
    }
  }

  const sqlInsert = `
    INSERT INTO transacciones (
      id,
      tipo_transaccion,
      cuenta_origen_id,
      cuenta_destino_id,
      cajero_id,
      servicio_id,
      monto,
      moneda,
      descripcion,
      estado,
      codigo_autorizacion,
      referencia_pago
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const paramsInsert = [
    id,
    tipo_transaccion,
    cuenta_origen_id,
    cuenta_destino_id || null,
    cajero_id || null,
    servicio_id || null,
    montoNum,
    moneda,
    descripcion || null,
    estado || 'completada',
    codigo_autorizacion || null,
    referencia_pago || null,
  ];

  await query(sqlInsert, paramsInsert);

  return {
    id,
    tipo_transaccion,
    cuenta_origen_id,
    cuenta_destino_id: cuenta_destino_id || null,
    cajero_id: cajero_id || null,
    servicio_id: servicio_id || null,
    monto: montoNum,
    moneda,
    descripcion: descripcion || null,
    estado: estado || 'completada',
    codigo_autorizacion: codigo_autorizacion || null,
    referencia_pago: referencia_pago || null,
  };
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
};
