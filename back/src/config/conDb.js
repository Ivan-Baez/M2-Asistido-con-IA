 
const mongoose = require("mongoose");
require("dotenv").config(); 
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a Mongo DB Atlas");
  } catch (error) {
    console.log("Error al conectar a MongoDB Atlas", error);
    process.exit(1); // opcional pero recomendable
  }
};

module.exports = connectDB;