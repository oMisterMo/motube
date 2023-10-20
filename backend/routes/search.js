const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const url = require("whatwg-url"); // node:url deprecated, querystring not following standardized specification
const { URLSearchParams } = require("whatwg-url");

// This stays in memory (only read once when server starts, to get updates I must re-read file on request)
const filePath = fs.readFileSync("public/views/search.html");

const timestampPOST = (req, res) => {
    const videoJSON = req.videoJSON;
    const videoPath = path.resolve(__dirname, "../data", "video.json");
    try {
        fs.writeFileSync(videoPath, JSON.stringify(videoJSON));
    } catch (err) {
        console.err(err);
        return res.status(500).send("Error writing file.");
    }
};

const timestampsPOST = (req, res) => {
    const videoJSON = req.videoJSON;
    const videoPath = path.resolve(__dirname, "../data", "videos.json");

    // Get
    const timestampsSTRING = fs.readFileSync(videoPath, "utf-8");
    const timestampsJSON = JSON.parse(timestampsSTRING);

    // Modify

    //TODO should extract this now that this method uses both timestamps files
    const foundIndex = timestampsJSON.findIndex(timestamp => timestamp.id === videoJSON.id);
    console.log("found undex: ", foundIndex);

    if (foundIndex >= 0) {
        console.log("Mo is RETURNING to an old video :D");

        // console.log("=====", videoJSON);
        // console.log("****", timestampsJSON[foundIndex]);

        // Reuse data from saved file
        videoJSON.created_at = timestampsJSON[foundIndex].created_at;
        videoJSON.timestamp = timestampsJSON[foundIndex].timestamp;

        // Set updated modified date
        timestampsJSON[foundIndex].modified_at = videoJSON.modified_at;
        // timestampsJSON[foundIndex].timestamp = videoJSON.timestamp;
        // timestampsJSON[foundIndex].playing = videoJSON.playing;
        // timestampsJSON[foundIndex].title = videoJSON.title;

        // Save
        try {
            fs.writeFileSync(videoPath, JSON.stringify(timestampsJSON));
            console.log("Successfully updated video!");
            // return res.status(201).end();
        } catch (err) {
            console.err(err);
            return res.status(500).send("Error writing file.");
        }

        // return res.status(200).end();
    } else {
        timestampsJSON.push(videoJSON);

        // Save
        try {
            fs.writeFileSync(videoPath, JSON.stringify(timestampsJSON));
            console.log("Successfully added new video!");
            // return res.status(201).end();
        } catch (err) {
            console.err(err);
            return res.status(500).send("Error writing file.");
        }
    }
};

const searchGET = async (req, res) => {
    // Destructure search parameter, should always be a youtube link here
    const { v: youtubeURL, type } = req.query;
    req.type = type;

    console.log("youtube url: ", youtubeURL);
    console.log("type: ", type);

    // If theres a search parameter found, we must add the new video to DB
    if (youtubeURL) {
        const youtubeREGEX = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/;
        const validURL = youtubeREGEX.test("youtube.com/watch?v=23456");

        if (validURL) {
            // Save
            const query = url.parseURL(youtubeURL).query;
            const params = new URLSearchParams(query);

            console.log("query: ", query);

            // Default data
            const videoJSON = {
                id: params.get("v"),
                url: youtubeURL,
                modified_at: Date.now(),
            };
            req.videoJSON = videoJSON;

            if (req.type === "0") {
                console.log("ADD VIDEO, TIMESTAMP = 0");
                const videoJSON = {
                    id: params.get("v"),
                    url: youtubeURL,
                    timestamp: 0,
                    created_at: Date.now(),
                    modified_at: Date.now(),
                };
                req.videoJSON = videoJSON;
            }
            if (req.type === "1") {
                console.log("REUSE TIMESTAMP");
            }

            console.log("using data: ", req.videoJSON);

            timestampsPOST(req, res);
            timestampPOST(req, res);

            // Save data of video to watch
            console.log("videoJSON ", videoJSON);
        } else {
            console.error(err);
            res.status(404).send("Not a valid youtube URL");
        }
    }

    // Load search page
    try {
        // res.status(200).type("html").send(filePath);
        res.status(200).type("html").send(fs.readFileSync("public/views/search.html"));
    } catch (err) {
        console.error(err);
        res.status(404).send("File not found");
    }
};

router.get("/", searchGET);

module.exports = router;
