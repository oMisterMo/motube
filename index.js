const express = require("express");
const app = express();

let timestamp = 0;

// Simple logger
app.use((req, res, next) => {
    if (req.path === "/") {
        console.log("\n\nip: ", req.ip);
    }
    console.log(req.method, " ", req.path);

    next();
});

app.use(express.static("public")); // Allows me to reference assets using /assets/x.png
app.use(express.static("public/src")); // can reference files in /public/src directly

app.get("/", (req, res) => {
    res.send("error, this should be overridden...!");
});

app.get("/timestamp", (req, res) => {
    timestamp++;
    res.send(timestamp.toString());
});

app.listen(3000, () => {
    console.log("Listening on port 3000...");
});
