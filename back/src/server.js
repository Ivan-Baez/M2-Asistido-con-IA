const express = require("express");
const moviesRouter = require("./routes/moviesRouter");
const chatbotRouter = require("./routes/chatbotRouter");
const assistantRouter = require("./routes/assistantRouter");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// ✅ Configuración de CORS (por ahora abierto para pruebas)
app.use(cors());

// ✅ Middlewares
app.use(morgan("dev"));
app.use(express.json());

// ✅ Ruta raíz para verificar que el servidor responde
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// ✅ Rutas
app.use(moviesRouter);
app.use("/api", chatbotRouter);
app.use("/api", assistantRouter);

module.exports = app;
