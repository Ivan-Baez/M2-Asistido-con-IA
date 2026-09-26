const mongoose = require ("mongoose");
const { Schema } = mongoose;

const movieSchema = new Schema ({
title: {type: String,required:true},
year: Number,
director: String,
duration: String,
genres: [String],
rate: Number,
poster: String,
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;