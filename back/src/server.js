

const express = require("express");
const moviesRouter = require("./routes/moviesRouter");
const chatbotRouter = require("./routes/chatbotRouter");
const assistantRouter = require("./routes/assistantRouter");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(moviesRouter);
app.use("/api", chatbotRouter);
app.use("/api", assistantRouter);

module.exports = app;