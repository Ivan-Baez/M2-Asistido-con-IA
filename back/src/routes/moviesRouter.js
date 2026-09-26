
const express = require("express");
const { getAllMovies, getMovieById, createMovies, deleteMovie } = require("../controllers/moviesController.js");

const router = express.Router();

router.get("/movies", getAllMovies);
router.get("/movies/:id", getMovieById);
router.post("/movies", createMovies);
router.delete("/movies/:id", deleteMovie);

module.exports = router;
