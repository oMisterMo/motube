const fs = require("fs").promises;
// const fs = require("fs/promises") // Same thing

const search = async (req, res) => {
    // Destructure search parameter
    const { v } = req.query;

    if (!v) {
        res.status(404).send("Video not found");
        return;
    }

    try {
        const file = await fs.readFile("public/pages/search.html");
        res.status(200).type("html").send(file);
    } catch (err) {
        console.error(err);
        res.status(404).send("File not found");
    }
};

module.exports = search;
