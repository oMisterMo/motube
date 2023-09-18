const express = require("express");
const app = express();

const logger = require("./routes/logger");
const search = require("./routes/search");
const timestamp = require("./routes/timestamp");

app.use(logger); // Simple log method & path
// app.use((req, res, next) => {
//     req.headers["access-control-allow-origin"] = "*";
//     next();
// });
app.use(express.static("public")); // Allows me to reference assets using /assets/x.png
app.use(express.static("public/src")); // can reference files in /public/src directly
app.use("/timestamp", timestamp); // use timestamp file to handle endpoints

// Does nothing, default route is served through static middleware
app.get("/", (req, res) => {
    res.send("error, this should be overridden...!");
});
app.get("/search", search);

module.exports = { app };
