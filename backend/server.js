const express = require("express");
const app = express();

const logger = require("./middleware/logger");

const search = require("./routes/search");
const timestamp = require("./routes/timestamp");
const timestamps = require("./routes/timestamps");

// Apply middlewares
app.use(logger); // Simple log method & path
app.use(express.static("public")); // Allows me to reference assets using /assets/x.png
// app.use(express.static("public/src")); // can reference files in /public/src directly
app.use(express.static("public/views")); // can reference files in /public/src directly
app.use("/search", search); // use timestamp file to handle endpoints
app.use("/timestamp", timestamp); // use timestamp file to handle endpoints
app.use("/timestamps", timestamps); // use timestamp file to handle endpoints

// Does nothing, default route is served through static middleware
app.get("/", (req, res) => {
    res.send("error, this should be overridden...!");
});

module.exports = { app };
