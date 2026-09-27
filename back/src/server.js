const express = require("express");
const moviesRouter = require("./routes/moviesRouter");
const chatbotRouter = require("./routes/chatbotRouter");
const assistantRouter = require("./routes/assistantRouter");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

// Configuración de CORS con dominio del frontend
app.use(cors({
  origin: "https://m2-asistido-con-ia-1.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(moviesRouter);
app.use("/api", chatbotRouter);
app.use("/api", assistantRouter);

module.exports = app;
