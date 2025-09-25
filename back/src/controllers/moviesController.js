const { getAllMoviesService, createMoviesService } = require("../services/moviesService");

const getAllMovies = async (req, res) => {
  try {
    const allMovies = await getAllMoviesService();
    res.json(allMovies);
  } catch (error) {
    console.error("Fallo el controlador de getAllMovies", error);
    res.status(400).json({ message: "Fallo al obtenerse las películas", error });
  }
};

const createMovies = async (req, res) => {
  try {
    const { title, year, director, duration, genres, rate, poster } = req.body;
    const newMovie = await createMoviesService({ title, year, director, duration, genres, rate, poster });
    res.status(201).json({ message: "Película creada correctamente", newMovie });
  } catch (error) {
    console.error("Fallo en el controlador de createMovies", error);
    res.status(400).json({ message: "Fallo al crearse la película", error });
  }
};

module.exports = {
  getAllMovies,
  createMovies
};