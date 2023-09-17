const logger = (req, res, next) => {
    if (req.path === "/") {
        console.log("\n\nip: ", req.ip);
    }
    console.log(req.method, " ", req.path);

    next();
};

module.exports = logger;
