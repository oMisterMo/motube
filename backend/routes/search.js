const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

// This stays in memory (only read once when server starts, to get updates I must re-read file on request)
const filePath = fs.readFileSync("public/views/search.html");

const searchGET = async (req, res) => {
    // Destructure search parameter
    const { v } = req.query;

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
