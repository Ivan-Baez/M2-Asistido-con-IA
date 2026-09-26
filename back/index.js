
require('dotenv').config();
console.log("API KEY cargada:", process.env.OPENAI_API_KEY);
console.log("Modelo cargado:", process.env.OPENAI_MODEL);

const app = require("./src/server");
const connectDB = require("./src/config/conDb");

// Render asigna el puerto automáticamente
const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error("Error al conectar con la base de datos:", err.message);
});

