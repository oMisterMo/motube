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

const filename = "videos.json";
const filePath = path.resolve(__dirname, "../", filename);

if (!fs.existsSync(filePath)) {
    console.log(`Can not find ${filename}, creating it now...`);
    fs.writeFileSync("./backend/" + filename, "");
}

const timestampGET = (req, res) => {
    const file = fs.readFileSync(filePath, "utf-8");
    return res.type("json").send(file);
};
const timestampPOST = (req, res) => {
    const videoJSON = req.body;
    console.log("video is: ", videoJSON);

    if (videoJSON) {
        // Get
        const timestampsSTRING = fs.readFileSync(filePath, "utf-8");
        const timestampsJSON = JSON.parse(timestampsSTRING);

        // Modify
        const foundIndex = timestampsJSON.findIndex(timestamp => timestamp.id === videoJSON.id);
        console.log("found undex: ", foundIndex);

        if (foundIndex >= 0) {
            console.log("Mo is RETURNING to an old video :D");
            return res.status(200).end();
        } else {
            timestampsJSON.push(videoJSON);

            // Save
            try {
                fs.writeFileSync(filePath, JSON.stringify(timestampsJSON));
                console.log("Successfully added new video!");
                return res.status(201).end();
            } catch (err) {
                console.err(err);
                return res.status(500).send("Error writing file.");
            }
        }
    }
    return res.status(500).send("No url found.");
};
const timestampPUT = (req, res) => {
    const videoJSON = req.body;

    // console.log("video to update: ", videoJSON);

    if (videoJSON) {
        // Get
        const timestampsSTRING = fs.readFileSync(filePath, "utf-8");
        const timestampsJSON = JSON.parse(timestampsSTRING);

        // Modify
        // console.log("LENGTH ", timestampsJSON.length);
        const foundIndex = timestampsJSON.findIndex(timestamp => timestamp.id === videoJSON.id);

        if (foundIndex >= 0) {
            // Mutate original array

            // timestampsJSON[foundIndex].id = videoJSON.id;
            timestampsJSON[foundIndex].modified_at = videoJSON.modified_at;
            timestampsJSON[foundIndex].timestamp = videoJSON.timestamp;
            timestampsJSON[foundIndex].playing = videoJSON.playing;
            timestampsJSON[foundIndex].title = videoJSON.title;

            // Save
            try {
                fs.writeFileSync(filePath, JSON.stringify(timestampsJSON));
                return res.status(201).end();
            } catch (err) {
                console.err(err);
                return res.status(500).send("Error writing file.");
            }
        }
    }
    return res.status(500).send("No url found.");
};

// router.use((req, res, next) => {
//     console.log("timestamp middleware");
//     next();
// });
router.get("/", timestampGET);
router.post("/", timestampPOST);
router.put("/", timestampPUT);

module.exports = router;
