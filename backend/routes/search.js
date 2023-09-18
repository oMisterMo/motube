const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

const filePath = fs.readFileSync("public/views/search.html");

const searchGET = async (req, res) => {
    // Destructure search parameter
    const { v } = req.query;

    try {
        res.status(200).type("html").send(filePath);
    } catch (err) {
        console.error(err);
        res.status(404).send("File not found");
    }
};

router.get("/", searchGET);

module.exports = router;
