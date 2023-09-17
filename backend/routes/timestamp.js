const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
router.use(express.json());

let counter = 0;
let seconds = 0;

const timestamp = (req, res) => {
    const file = fs.readFileSync(path.resolve(__dirname, "../video.json"));
    res.type("json").send(file);
};

router.get("/", timestamp);
router.post("/", (req, res) => {
    console.log(req.body);

    // Get value from request

    // Convert to number

    // Update seconds
    res.end();
});

module.exports = router;
