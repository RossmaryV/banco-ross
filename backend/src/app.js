const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`🏦 Backend corriendo en: http://localhost:${PORT}`);
});