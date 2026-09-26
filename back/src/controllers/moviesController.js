const { getAllMoviesService, getMovieByIdService, createMoviesService, deleteMovieService } = require("../services/moviesService");
const MovieDTO = require("../dto/movieDTO");
const CreateMovieDTO = require("../dto/createMovieDTO");

const getAllMovies = async (req, res) => {
  try {
    const mode = req.query.mode || "normal";
    const allMovies = await getAllMoviesService(mode);
    const moviesDTO = MovieDTO.fromArray(allMovies);
    res.json(moviesDTO);
  } catch (error) {
    console.error("Fallo el controlador de getAllMovies", error);
    res.status(400).json({ message: "Fallo al obtenerse las películas", error });
  }
};

const getMovieById = async (req, res) => {
  try {
    const mode = req.query.mode || "normal";
    const { id } = req.params;
    const movie = await getMovieByIdService(id, mode);
    if (!movie) {
      return res.status(404).json({ message: "Película no encontrada" });
    }
    const movieDTO = new MovieDTO(movie);
    res.json(movieDTO);
  } catch (error) {
    console.error("Fallo el controlador de getMovieById", error);
    res.status(400).json({ message: "Fallo al obtener la película", error });
  }
};

const createMovies = async (req, res) => {
  try {
    const mode = req.query.mode || "normal";
    const createDTO = new CreateMovieDTO(req.body);
    
    const validationErrors = createDTO.validate();
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: "Datos de película inválidos", errors: validationErrors });
    }
    
    const newMovie = await createMoviesService(createDTO, mode);
    const movieDTO = new MovieDTO(newMovie);
    res.status(201).json({ message: "Película creada correctamente", newMovie: movieDTO });
  } catch (error) {
    console.error("Fallo en el controlador de createMovies", error);
    res.status(400).json({ message: "Fallo al crearse la película", error });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const mode = req.query.mode || "normal";
    const { id } = req.params;
    const deletedMovie = await deleteMovieService(id, mode);
    if (!deletedMovie) {
      return res.status(404).json({ message: "Película no encontrada" });
    }
    res.json({ message: "Película eliminada correctamente" });
  } catch (error) {
    console.error("Fallo en el controlador de deleteMovie", error);
    res.status(400).json({ message: "Fallo al eliminar la película", error });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovies,
  deleteMovie
};