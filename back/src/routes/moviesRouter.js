
const express = require ("express");
const {getAllMovies,createMovies  } = require ("../controllers/moviesController.js") 

const router = express.Router();

router.get("/movies", getAllMovies);
router.post("/movies",createMovies)

module.exports = router;
