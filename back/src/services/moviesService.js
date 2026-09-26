const Movie = require("../models/movieModel");
const MovieDemo = require("../models/movieDemoModel");

const getModel = (mode) => {
  return mode === "demo" ? MovieDemo : Movie;
};

const logDemoOperation = (operation, mode, details = {}) => {
  if (mode === "demo") {
    const timestamp = new Date().toISOString();
    console.log(`[DEMO AUDIT] ${timestamp} | ${operation} | ${JSON.stringify(details)}`);
  }
};

const getAllMoviesService = async (mode = "normal") => {
  try {
    const Model = getModel(mode);
    const movies = await Model.find();
    logDemoOperation("READ_ALL", mode, { count: movies.length });
    return movies;
  } catch (error) {
    console.log("Error al ejecutar el método getAllMovies", error);
    throw error;
  }
};

const getMovieByIdService = async (id, mode = "normal") => {
  try {
    const Model = getModel(mode);
    const movie = await Model.findById(id);
    logDemoOperation("READ_ONE", mode, { movieId: id, title: movie?.title });
    return movie;
  } catch (error) {
    console.log("Error al ejecutar el método getMovieByIdService", error);
    throw error;
  }
};

const createMoviesService = async (movieData, mode = "normal") => {
  try {
    const Model = getModel(mode);
    const newMovie = await Model.create(movieData);
    logDemoOperation("CREATE", mode, { movieId: newMovie._id, title: newMovie.title });
    return newMovie;
  } catch (error) {
    console.log("Error al ejecutar el método createMoviesService", error);
    throw error;
  }
};

const deleteMovieService = async (id, mode = "normal") => {
  try {
    const Model = getModel(mode);
    const deletedMovie = await Model.findByIdAndDelete(id);
    logDemoOperation("DELETE", mode, { movieId: id, title: deletedMovie?.title });
    return deletedMovie;
  } catch (error) {
    console.log("Error al ejecutar el método deleteMovieService", error);
    throw error;
  }
};

module.exports = {
  getAllMoviesService,
  getMovieByIdService,
  createMoviesService,
  deleteMovieService
};