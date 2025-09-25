

const express = require("express");
const moviesRouter= require("./routes/moviesRouter");
const cors = require("cors");
const morgan = require("morgan")
const app = express();

//Midlleware rules
app.use(morgan("dev"))
app.use(cors())
app.use(express.json())
app.use(moviesRouter)

module.exports = app;