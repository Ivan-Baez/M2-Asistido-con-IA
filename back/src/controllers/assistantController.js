const { processMessage } = require("../services/assistantService");
const Movie = require("../models/movieModel");

const assistant = async (req, res) => {
  try {
    const { message, sessionId, history, userMovies: clientMovies } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        message: "El mensaje es requerido",
        error: "Invalid input" 
      });
    }

    // Use movies from frontend if provided, otherwise fetch from DB
    let userMovies = clientMovies || [];
    if (!userMovies.length) {
      try {
        userMovies = await Movie.find({}).lean();
      } catch (e) {
        console.warn('Could not fetch movies:', e.message);
      }
    }

    const result = await processMessage(message.trim(), userMovies, history || []);
    
    res.json({
      response: result.response,
      movies: result.movies || [],
      state: result.state || 'idle',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error en assistant:", error);
    res.status(500).json({ 
      message: "Error procesando el mensaje",
      error: error.message 
    });
  }
};

module.exports = { assistant };