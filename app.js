// const server = require("./public/server/server");
const { app } = require("./backend/server");

app.listen(3000, () => {
    console.log("Listening on port 3000...");
});
