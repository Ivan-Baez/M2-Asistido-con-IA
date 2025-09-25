const Movie = require("../models/movieModel");

const getAllMoviesService = async () => {
  try {
    const movies = await Movie.find();
    return movies;
  } catch (error) {
    console.log("Error al ejecutar el método getAllMovies", error);
    throw error;
  }
};

const createMoviesService = async (movieData) => {
  try {
    const newMovie = await Movie.create(movieData);
    return newMovie;
  } catch (error) {
    console.log("Error al ejecutar el método createMoviesService", error);
    throw error;
  }
};

module.exports = {
  getAllMoviesService,
  createMoviesService
};