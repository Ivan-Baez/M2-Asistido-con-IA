const { processMessage } = require("../services/chatbotService");
const Movie = require("../models/movieModel");

const chatbot = async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        message: "El mensaje es requerido",
        error: "Invalid input"
      });
    }

    let userMovies = [];
    if (userId) {
      try {
        userMovies = await Movie.find({ userId }).lean();
      } catch (e) {
        console.warn('Could not fetch user movies:', e.message);
      }
    }

    const result = await processMessage(message.trim(), userMovies);
    
    res.json({
      response: result.response,
      movies: result.movies || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error en chatbot:", error);
    res.status(500).json({ 
      message: "Error procesando el mensaje",
      error: error.message 
    });
  }
};

module.exports = { chatbot };