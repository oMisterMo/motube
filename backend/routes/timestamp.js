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

const filename = "video.json";
const filePath = path.resolve(__dirname, "../", filename);

if (!fs.existsSync(filePath)) {
    console.log(`Can not find ${filename}, creating it now...`);
    fs.writeFileSync("./backend/" + filename, JSON.stringify({}));
}

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

    if (data.timestamp === 0) {
        return res.status(200).send("Video has not started yet...");
    }
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
