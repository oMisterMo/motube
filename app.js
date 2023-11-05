// const server = require("./public/server/server");
const { app } = require("./backend/server");
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
