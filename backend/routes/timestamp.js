let counter = 0;

const timestamp = (req, res) => {
    counter++;
    res.send(counter.toString());
};

module.exports = timestamp;
