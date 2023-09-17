const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
router.use(express.json());

let counter = 0;
let seconds = 0;

// Get value from request
// Convert to number
// Update seconds

const filePath = path.resolve(__dirname, "../video.json");

const timestampGET = (req, res) => {
    const file = fs.readFileSync(filePath);
    res.type("json").send(file);
};
const timestampPOST = (req, res) => {
    console.log(req.body);
    const data = req.body;
    console.log(data.url);

    if (data.url) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data));
        } catch (err) {
            res.status(500).send("Error writing file.");
        }
    }
    res.status(201).end();
};

router.use((req, res, next) => {
    console.log("timestamp middleware");
    next();
});
router.get("/", timestampGET);
router.post("/", timestampPOST);

module.exports = router;
