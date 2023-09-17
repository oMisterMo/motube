const search = (req, res) => {
    // Destructure search parameter
    const { v } = req.query;

    if (!v) {
        res.status(404).send("Video not found");
        return;
    }

    res.status(200).send(v);
};

module.exports = search;
