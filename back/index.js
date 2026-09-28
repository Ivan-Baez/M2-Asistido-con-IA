// index.js (backend)
require('dotenv').config();
console.log("API KEY cargada:", process.env.OPENAI_API_KEY);
console.log("Modelo cargado:", process.env.OPENAI_MODEL);

const express = require('express');
const cors = require('cors');
const app = require("./src/server");
const connectDB = require("./src/config/conDb");

// ✅ Configuración de CORS
app.use(cors({
  origin: [
    'https://m2-asistido-con-ia.onrender.com',   // dominio backend en Render
    'https://m2-asistido-con-ia-1.onrender.com', // dominio frontend en Render
    'http://localhost:3000'                      // frontend local (dev)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ✅ Puerto: Render asigna automáticamente, en local usamos 3001
const PORT = process.env.PORT || 3001;

// ✅ Conexión a la base de datos y arranque del servidor
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT} 🚀`);
    });
  })
  .catch(err => {
    console.error("Error al conectar con la base de datos:", err.message);
  });
