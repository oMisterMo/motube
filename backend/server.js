const express = require("express");
const app = express();

const logger = require("./routes/logger");
const search = require("./routes/search");
const timestamp = require("./routes/timestamp");

const start = () => {
    app.use(logger); // Simple log method & path
    app.use(express.static("public")); // Allows me to reference assets using /assets/x.png
    app.use(express.static("public/src")); // can reference files in /public/src directly

    // Does nothing, default route is served through static middleware
    app.get("/", (req, res) => {
        res.send("error, this should be overridden...!");
    });
    app.get("/search", search);
    app.get("/timestamp", timestamp);

    app.listen(3000, () => {
        console.log("Listening on port 3000...");
    });
};

module.exports = { start };
