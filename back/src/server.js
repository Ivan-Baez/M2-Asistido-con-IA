const express = require("express");
const moviesRouter = require("./routes/moviesRouter");
const chatbotRouter = require("./routes/chatbotRouter");
const assistantRouter = require("./routes/assistantRouter");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// ✅ Configuración de CORS primero
app.use(cors({
  origin: [
    "https://m2-asistido-con-ia-1.onrender.com", // dominio frontend
    "https://m2-asistido-con-ia.onrender.com"    // dominio backend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Middlewares
app.use(morgan("dev"));
app.use(express.json());

// ✅ Rutas
app.use(moviesRouter);
app.use("/api", chatbotRouter);
app.use("/api", assistantRouter);

module.exports = app;
