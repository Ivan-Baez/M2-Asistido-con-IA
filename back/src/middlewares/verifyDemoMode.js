const mongoose = require("mongoose");
const MovieDemo = require("../models/movieDemoModel");

const verifyDemoMode = async (req, res, next) => {
  const mode = req.query.mode;

  if (mode === "demo") {
    try {
      const collections = await mongoose.connection.db.listCollections({ name: "movies_demo" }).toArray();

      if (collections.length === 0) {
        await MovieDemo.createCollection();
        console.log("[DEMO MODE] Colección 'movies_demo' creada automáticamente");
      }

      console.log("[DEMO MODE] Verificación completada: modo demo activo, colección movies_demo disponible");
    } catch (error) {
      console.error("[DEMO MODE] Error verificando colección demo:", error);
      return res.status(500).json({ message: "Error inicializando modo demo", error: error.message });
    }
  }

  if (mode === "demo" && (req.method === "POST" || req.method === "DELETE")) {
    console.log(`[DEMO PROTECTION] ${req.method} request en modo demo - operando sobre movies_demo, movies protegida`);
  }

  next();
};

module.exports = { verifyDemoMode };