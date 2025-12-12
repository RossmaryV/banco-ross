// backend/src/modules/clientes/clientes.service.js
const { query } = require('../../db/connection');
const { randomUUID } = require('crypto'); // función nativa para UUID

// GET /api/clientes
async function obtenerTodos() {
  const sql = `
    SELECT
      id,
      tipo_identificacion,
      numero_identificacion,
      nombres,
      apellidos,
      fecha_nacimiento,
      nacionalidad,
      direccion,
      departamento,
      distrito,
      ciudad,
      telefono,
      email,
      fecha_creacion,
      fecha_actualizacion,
      estado
    FROM clientes
    LIMIT 100
  `;

  console.log('▶ Ejecutando SQL clientes...');
  const rows = await query(sql);
  console.log('✅ Filas obtenidas:', rows.length);
  return rows;
}

// GET /api/clientes/:id
async function obtenerPorId(id) {
  const sql = `
    SELECT
      id,
      tipo_identificacion,
      numero_identificacion,
      nombres,
      apellidos,
      fecha_nacimiento,
      nacionalidad,
      direccion,
      departamento,
      distrito,
      ciudad,
      telefono,
      email,
      fecha_creacion,
      fecha_actualizacion,
      estado
    FROM clientes
    WHERE id = ?
    LIMIT 1
  `;

  const rows = await query(sql, [id]);
  return rows[0] || null;
}

// POST /api/clientes
async function crear(data) {
  const id = randomUUID();

  const {
    tipo_identificacion,
    numero_identificacion,
    nombres,
    apellidos,
    fecha_nacimiento,
    nacionalidad = 'paraguaya',
    direccion,
    departamento,
    distrito,
    ciudad,
    telefono,
    email,
    estado = 'pendiente_verificacion',
  } = data;

  const sql = `
    INSERT INTO clientes (
      id,
      tipo_identificacion,
      numero_identificacion,
      nombres,
      apellidos,
      fecha_nacimiento,
      nacionalidad,
      direccion,
      departamento,
      distrito,
      ciudad,
      telefono,
      email,
      estado
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    id,
    tipo_identificacion,
    numero_identificacion,
    nombres,
    apellidos,
    fecha_nacimiento || null,
    nacionalidad,
    direccion || null,
    departamento || null,
    distrito || null,
    ciudad || null,
    telefono || null,
    email || null,
    estado,
  ];

  await query(sql, params);

  return {
    id,
    tipo_identificacion,
    numero_identificacion,
    nombres,
    apellidos,
    fecha_nacimiento,
    nacionalidad,
    direccion,
    departamento,
    distrito,
    ciudad,
    telefono,
    email,
    estado,
  };
}

// PUT /api/clientes/:id
async function actualizar(id, data = {}) {
  // Primero vemos si existe
  const actual = await obtenerPorId(id);
  if (!actual) {
    return null; // lo manejará el controller como 404
  }

  // Mezclamos valores nuevos con los actuales
  const tipo_identificacion = data.tipo_identificacion ?? actual.tipo_identificacion;
  const numero_identificacion = data.numero_identificacion ?? actual.numero_identificacion;
  const nombres = data.nombres ?? actual.nombres;
  const apellidos = data.apellidos ?? actual.apellidos;

  // si viene string vacío para fecha, lo dejamos en null
  const fecha_nacimiento =
    data.fecha_nacimiento === '' || data.fecha_nacimiento == null
      ? actual.fecha_nacimiento
      : data.fecha_nacimiento;

  const nacionalidad = data.nacionalidad ?? actual.nacionalidad;
  const direccion = data.direccion ?? actual.direccion;
  const departamento = data.departamento ?? actual.departamento;
  const distrito = data.distrito ?? actual.distrito;
  const ciudad = data.ciudad ?? actual.ciudad;
  const telefono = data.telefono ?? actual.telefono;
  const email = data.email ?? actual.email;
  const estado = data.estado ?? actual.estado;

  const sql = `
    UPDATE clientes
    SET
      tipo_identificacion = ?,
      numero_identificacion = ?,
      nombres = ?,
      apellidos = ?,
      fecha_nacimiento = ?,
      nacionalidad = ?,
      direccion = ?,
      departamento = ?,
      distrito = ?,
      ciudad = ?,
      telefono = ?,
      email = ?,
      estado = ?
    WHERE id = ?
  `;

  const params = [
    tipo_identificacion,
    numero_identificacion,
    nombres,
    apellidos,
    fecha_nacimiento || null,
    nacionalidad,
    direccion || null,
    departamento || null,
    distrito || null,
    ciudad || null,
    telefono || null,
    email || null,
    estado,
    id,
  ];

  await query(sql, params);

  // Devolvemos el objeto ya mezclado
  return {
    id,
    tipo_identificacion,
    numero_identificacion,
    nombres,
    apellidos,
    fecha_nacimiento,
    nacionalidad,
    direccion,
    departamento,
    distrito,
    ciudad,
    telefono,
    email,
    estado,
  };
}


module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
};
