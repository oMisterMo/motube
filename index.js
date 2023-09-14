const express = require("express");
const app = express();

app.use(express.static("public")); // Allows me to reference assets using /assets/x.png
app.use(express.static("public/src")); // can reference files in /public/src directly

app.get("/", (req, res) => {
    res.send("error, this should be overridden...!");
});

app.listen(3000, () => {
    console.log("Listening on port 3000...");
});
