const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const url = require("whatwg-url"); // node:url deprecated, querystring not following standardized specification
const { URLSearchParams } = require("whatwg-url");

// This stays in memory (only read once when server starts, to get updates I must re-read file on request)
const filePath = fs.readFileSync("public/views/search.html");

const searchGET = async (req, res) => {
    // Destructure search parameter, should always be a youtube link here
    const { v: youtubeURL } = req.query;

    // === Add test here ===

    const query = url.parseURL(youtubeURL).query;
    const params = new URLSearchParams(query);

    const videoJSON = {
        id: params.get("v"),
        url: youtubeURL,
        timestamp: 0,
        created_at: Date.now(),
        modified_at: Date.now(),
    };

    // Save data of video to watch
    console.log("data created: ", videoJSON);

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
