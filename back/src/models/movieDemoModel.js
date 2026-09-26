const mongoose = require("mongoose");
const { Schema } = mongoose;

const movieDemoSchema = new Schema({
  title: { type: String, required: true },
  year: Number,
  director: String,
  duration: String,
  genres: [String],
  rate: Number,
  poster: String,
});

const MovieDemo = mongoose.model("MovieDemo", movieDemoSchema, "movies_demo");

module.exports = MovieDemo;