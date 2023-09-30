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
    const file = fs.readFileSync(filePath, "utf-8");
    res.type("json").send(file);
};
const timestampPOST = (req, res) => {
    const data = req.body;

    if (data.url) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data));
            return res.status(201).end();
        } catch (err) {
            console.err(err);
            return res.status(500).send("Error writing file.");
        }
    }
    res.status(500).send("No url found.");
};
const timestampPUT = (req, res) => {
    const data = req.body;
    console.log(data);

    if (data.timestamp) {
        const file = fs.readFileSync(filePath, "utf-8");
        const updatedData = Object.assign(JSON.parse(file), data);
        try {
            fs.writeFileSync(filePath, JSON.stringify(updatedData));
            return res.status(201).end();
        } catch (err) {
            console.err(err);
            return res.status(500).send("Error writing file.");
        }
    }
    res.status(500).send("No timestamp found.");
};

// router.use((req, res, next) => {
//     console.log("timestamp middleware");
//     next();
// });
router.get("/", timestampGET);
router.post("/", timestampPOST);
router.put("/", timestampPUT);

module.exports = router;
