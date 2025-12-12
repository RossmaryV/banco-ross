// backend/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { pool } = require('./db/connection');
const clientesRoutes = require('./modules/clientes/clientes.routes');
const cuentasRoutes = require('./modules/cuentas/cuentas.routes');
const tarjetasRoutes = require('./modules/tarjetas/tarjetas.routes');
const prestamosRoutes = require('./modules/prestamos/prestamos.routes');
const transaccionesRoutes = require('./modules/transacciones/transacciones.routes');
const serviciosRoutes = require ('./modules/servicios/servicios.routes');
const cajeroRoutes = require ('./modules/cajeros/cajeros.routes');
const usuariosRoutes = require ('./modules/usuarios/usuarios.routes');
const authRoutes = require('./modules/auth/auth.routes');

const app = express();

// Middlewares básicos
app.use(cors());
app.use(helmet());
app.use(express.json());

// Probar conexión a DB al iniciar
pool
  .getConnection()
  .then(conn => {
    console.log('✅ Conectado a MariaDB correctamente');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar a MariaDB:', err);
  });

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend funcionando!',
    timestamp: new Date().toISOString(),
  });
});

// Rutas del módulo clientes
app.use('/api/clientes', clientesRoutes);

app.use('/api/cuentas', cuentasRoutes);

app.use('/api/tarjetas', tarjetasRoutes);

app.use('/api/prestamos', prestamosRoutes);

app.use('/api/transacciones', transaccionesRoutes);

app.use('/api/servicios', serviciosRoutes)

app.use('/api/cajeros', cajeroRoutes)

app.use ('/api/usuarios', usuariosRoutes)

app.use('/api', authRoutes); // ahora tienes POST /api/login


// Iniciar servidor
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en: http://localhost:${PORT}`);
});
